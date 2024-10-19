const { Router } = require("express");
const {
  handleUserLogin,
  handleUserLogout,
  handleUserSignup,
} = require("../controllers/user.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const userRouter = Router();

userRouter.post("/signup", handleUserSignup);
userRouter.post("/login", handleUserLogin);
userRouter.post("/logout", verifyJwt, handleUserLogout);

module.exports = userRouter;
