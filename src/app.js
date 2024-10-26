const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const coockieparser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middleware/Auth.middleware");
const app = express();
app.use(express.json());
app.use(coockieparser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    // console.log("user" + user);

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token && Expire JWT token

      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$2108", {
        expiresIn: "1d",
      });
      console.log("token : " + token);

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send connection");
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot connected...");
  });
