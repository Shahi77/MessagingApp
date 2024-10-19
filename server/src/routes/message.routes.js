const { Router } = require("express");
const {
  handleSendMessage,
  handleGetMessage,
} = require("../controllers/message.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const messageRouter = Router();

messageRouter.post("/:receiverId", verifyJwt, handleSendMessage);
messageRouter.get("/:receiverId", verifyJwt, handleGetMessage);

module.exports = messageRouter;
