const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app } = require("./service/socketServer");
const { connectDB } = require("./service/dbConnect");
const v1Router = require("./routes/version1.routes");
const morgan = require("morgan");
require("dotenv").config();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/v1", v1Router);
const init = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to intialize the server:", error);
  }
};

init();
