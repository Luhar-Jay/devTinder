const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  const user = await User.findOne({ emailId: userEmail });
  res.send(user);

  //   try {
  //     const user = await User.find({ emailId: userEmail });
  //     if (user.length === 0) {
  //       res.status(404).send("User not found");
  //     } else {
  //       res.send(user);
  //     }
  //   } catch (error) {
  //     res.status(400).send("Something went wrong!");
  //   }
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
