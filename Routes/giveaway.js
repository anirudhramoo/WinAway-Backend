const express = require("express");
const router = express.Router();
const Giveaway = require("../models/Giveaway");
const { Channel } = require("../models/Channel");
const _ = require("lodash");
const Joi = require("joi");
const auth = require("../middleware/auth");
const upload = require("../Services/fileUpload");

const schema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  prize: Joi.string().required().min(5).max(255),
  channel: Joi.object().required(),
  enter: Joi.array().items(
    Joi.object()
      .keys({
        requirements: Joi.array()
          .items(Joi.string().min(2).max(200))
          .required(),
        draw: Joi.number().required().min(1),
      })
      .required()
  ),
  expiryDate: Joi.date()
    .required()
    .min(Date.now())
    .max(Date.now() + 365 * 24 * 60 * 60000),
  contact: Joi.string().required().min(3).max(255),
  value: Joi.number().required().min(10).max(10000000),
  creator: Joi.string().required(),
  image: Joi.string().required(),
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/", async (req, res) => {
  try {
    if (req.query.search) {
      if (req.query.search == "blank") return res.status(200).json([]);
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
      let searchResults = await Giveaway.find({
        $or: [{ "channel.name": regex }, { title: regex }],
      });
      searchResults = searchResults.slice(
        0,
        Math.min(18, searchResults.length)
      );
      return res.status(200).json(searchResults);
    }

    let giveaways = await Giveaway.find({});
    if (giveaways.length) {
      giveaways = _.sortBy(giveaways, [
        "value",
        "channel.subscribers",
      ]).reverse();
    }
    giveaways = giveaways.slice(0, Math.min(18, giveaways.length));
    return res.status(200).json(giveaways);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const giveaway = await Giveaway.findById(id);
    if (!giveaway)
      return res.status(404).json({ message: "No giveaway with that id" });
    return res.status(200).json(giveaway);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", [auth, upload.single("image")], async (req, res) => {
  try {
    req.body.creator = req.userId;
    req.body.enter.splice(0, 1);
    req.body.channel = JSON.parse(req.body.channel);

    if (req.file) req.body.image = req.file.location;
    for (let i = 0; i < req.body.enter.length; i++) {
      req.body.enter[i] = JSON.parse(req.body.enter[i]);
      delete req.body.enter[i]._id;
    }

    const id = req.params.id;
    let giveaway = await Giveaway.findById(id);

    if (!giveaway)
      return res.status(404).json({ message: "That giveaway does not exist" });

    req.body.image = giveaway.image;

    if (req.file) req.body.image = req.file.location;
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
    }
    giveaway = await Giveaway.findByIdAndUpdate(id, req.body, { new: true });
    const { channelId } = req.body.channel;
    let channel = await Channel.findOne({ channelId });
    if (!channel) channel = new Channel(req.body.channel);
    await channel.save();

    res.status(200).json(giveaway);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    req.body.creator = req.userId;
    req.body.enter.splice(0, 1);
    req.body.channel = JSON.parse(req.body.channel);

    if (!req.file)
      return res.status(400).json({ message: "Please enter an image" });
    req.body.image = req.file.location;
    for (let i = 0; i < req.body.enter.length; i++) {
      req.body.enter[i] = JSON.parse(req.body.enter[i]);
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const giveaway = new Giveaway(req.body);

    await giveaway.save();
    const { channelId } = req.body.channel;
    let channel = await Channel.findOne({ channelId });
    if (!channel) channel = new Channel(req.body.channel);
    await channel.save();
    res.json(giveaway).status(200);
  } catch (err) {
    console.log(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const giveaway = await Giveaway.findById(id);
    if (!giveaway)
      res.status(404).json({ message: "No giveaway with that id" });
    await Giveaway.findByIdAndDelete(id);
    res.status(200).json({ message: "The giveaway has been deleted" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
