const express = require("express");
const { userAuth } = require("../middleware/Auth");

const requestsRouter = express.Router();
requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send connection");
});
module.exports = requestsRouter;
