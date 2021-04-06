const express = require("express");
const router = express.Router();
const Giveaway = require("../models/Giveaway");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const giveaway = await Giveaway.findOne({ creator: req.userId });
    if (giveaway) return res.status(200).send(giveaway._id);
    return res.status(200).send(false);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
