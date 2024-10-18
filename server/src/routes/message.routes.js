const { Router } = require("express");
const {
  handleSendMessage,
  handleGetMessage,
} = require("../controllers/message.controller");

const messageRouter = Router();

messageRouter.post("/:receiverId", handleSendMessage);
messageRouter.get("/:receiverId", handleGetMessage);

module.exports = messageRouter;
