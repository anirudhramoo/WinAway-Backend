const mongoose = require("mongoose");
const { Channel, channelSchema } = require("./Channel");
const { requirementSchema } = require("./Requirements");
const giveawaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    minlength: 3,
  },
  channel: {
    type: channelSchema,
    required: true,
  },
  prize: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5,
  },
  enter: {
    type: [requirementSchema],
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
    max: Date.now() + 365 * 24 * 60 * 60000,
    min: Date.now(),
  },
  contact: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  value: {
    type: Number,
    min: 0,
    max: 10000000,
  },
  creator: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Giveaway = mongoose.model("Giveaway", giveawaySchema);

module.exports = Giveaway;
