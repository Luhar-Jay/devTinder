const express = require("express");
const app = express();

// Rout handler
// app.use("/", (req, res) => {
//   res.send("Hello server!!!!");
// });
app.use("/test", (req, res) => {
  res.send("Testing the server!");
});
app.use("/hello/2", (req, res) => {
  res.send("abracadabra");
});
app.get("/user", (req, res) => {
  console.log(req.query);

  res.send({
    firstName: "Jay",
    lastName: "Luhar",
  });
});
app.post("/user", (req, res) => {
  res.send("Data saved Successfully ");
});
app.delete("/user", (req, res) => {
  res.send("Data deleted Successfully ");
});

// /abcd & /acd it work => in the b is optional
app.use("/ab?cd", (req, res) => {
  res.send("ab?cd");
});
app.use("/ab*cd", (req, res) => {
  res.send("ab*cd in  anything in the path /abcd, /abJFHcd, ab123cd");
});

// Listen to the server
app.listen(3000, () => {
  console.log("Setver is successfully listening on port 3000....");
});
