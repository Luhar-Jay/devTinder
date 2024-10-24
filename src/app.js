const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const coockieparser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
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
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token

      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@2108");
      console.log("token : " + token);

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successfully!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    // Validate my token
    if (!token) {
      throw new Error("Invalid token!!");
    }
    const decodedMesaage = await jwt.verify(token, "DEV@Tinder@2108");
    const { _id } = decodedMesaage;

    console.log("Logged in user is: " + _id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  // same email with single user find
  // const user = await User.findOne({ emailId: userEmail });
  // res.send(user);

  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

// Feed API - GET /feed - get all the users from the database

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

// Delete a user from the database
app.delete("/userDelete", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

//Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "age",
      "photoUrl",
      "about",
      "gender",
      "skills",
      "password",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more the 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully.");
  } catch (error) {
    res.status(404).send("UPDATE FAILED: " + error.message);
  }
});
// update user of using email id
// app.patch("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   const data = req.body;

//   try {
//     const user = await User.findOneAndUpdate({ emailId: userEmail }, data);
//     res.send("User updated successfully.");
//   } catch (error) {
//     res.status(404).send("Somthing went wrong!");
//   }
// });

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
