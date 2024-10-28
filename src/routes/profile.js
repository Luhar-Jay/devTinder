const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!!!");
    }

    const loggedIn = req.user;
    loggedIn.save();
    Object.keys(req.body).forEach((key) => (loggedIn[key] = req.body[key]));

    res.json({
      message: `${loggedIn.firstName}, your profile update successfully`,
      data: loggedIn,
      status: 0,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
