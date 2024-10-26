const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    // Encrypt password
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      age,
      gender,
      photoUrl,
      about,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      age,
      gender,
      photoUrl,
      about,
    });

    await user.save();
    res.send("User Added successfully!");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    // console.log("user" + user);

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token && Expire JWT token

      const token = await user.getJWT();
      //Add the token to cookie and send the response back to the user && expires cookies
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfully!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = authRouter;
