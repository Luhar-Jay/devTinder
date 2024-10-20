const express = require("express");
const app = express();

// send message on the server
// app.use("/", (req, res) => {
//   res.send("Hello server!!!!");
// });
app.use("/test", (req, res) => {
  res.send("Testing the server!");
});
app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

// Listen to the server
app.listen(2121, () => {
  console.log("Setver is successfully listening on port 2121....");
});
