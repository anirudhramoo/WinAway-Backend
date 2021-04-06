const express = require("express");
const router = express.Router();
const { Channel } = require("../models/Channel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
const jwt = require("jsonwebtoken");

router.post("/google", async (req, res) => {
  try {
    const { channelId, name, subscribers } = req.body;
    let channel = await Channel.findOne({ channelId });
    if (!channel) {
      channel = new Channel({
        name,
        subscribers,
        channelId,
      });
      await channel.save();
    } else {
      channel.subscribers = subscribers;
      await channel.save();
    }
    res.status(200).json(channel);
  } catch (err) {
    console.log(err);
  }
});

router.post("/token", async (req, res) => {
  try {
    let { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT,
    });
    const { sub, email, name } = ticket.getPayload();
    token = await jwt.sign({ sub, email, name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

/*
When user logs in, upon success, the frontend stores a token,access_token and makes an api call to 
display all the channel owned by the user. When the user chooses a specific channel the frontend checks if it is valid and sends 
a post request with the channel name,id,subscribers. Here we store the channel details.




*/
