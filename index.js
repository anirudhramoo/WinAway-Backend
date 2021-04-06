const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const giveawayRouter = require("./Routes/giveaway");
const authRouter = require("./Routes/auth");
const checkRouter = require("./Routes/checkCreated");
const bodyParser = require("body-parser");
const cors = require("cors");
const autoDelete = require("./Update/update");

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(cors());
app.use("/images", express.static("images"));
async function connect() {
  try {
    await mongoose.connect(process.env.PRODUCTION_MONGO_URL);
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
}
connect();

app.use("/giveaways", giveawayRouter);
app.use("/auth", authRouter);
app.use("/checkCreated", checkRouter);

// autoDelete();

const port = process.env.port || 4000;
app.listen(port, () => {
  console.log("Server Listening on port " + port);
});
