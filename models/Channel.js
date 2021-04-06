const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 3,
  },
  subscribers: {
    type: Number,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
});

const Channel = mongoose.model("channel", channelSchema);

module.exports.channelSchema = channelSchema;
module.exports.Channel = Channel;
