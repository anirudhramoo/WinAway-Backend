const Giveaway = require("../models/Giveaway");

const autoDelete = () => {
  setInterval(async () => {
    await Giveaway.deleteMany({
      expiryDate: { $lte: Date.now() },
    });
  }, 1000);
};
module.exports = autoDelete;
