const { Router } = require("express");
const messageRouter = require("./message.routes");
const userRouter = require("./user.routes");

const v1Router = Router();
v1Router.use("/messages", messageRouter);
v1Router.use("/user", userRouter);
module.exports = v1Router;
