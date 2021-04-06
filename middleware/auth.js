const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      res.status(403).json({ message: "not authorised" });
    const token = req.headers?.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { sub } = decoded;
    req.userId = sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: "You  not authorised to do that" });
  }
};

module.exports = auth;
