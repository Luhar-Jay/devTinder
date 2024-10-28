const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.send("Invalid token!!!");
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$2108");

    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      return new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  userAuth,
};
