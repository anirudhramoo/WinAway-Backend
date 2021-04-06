const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  requirements: {
    type: [String],
    required: true,
  },
  draw: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports.requirementSchema = requirementSchema;
