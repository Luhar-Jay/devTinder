const express = require("express");
const connectDB = require("./config/database");
const coockieparser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(coockieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

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
