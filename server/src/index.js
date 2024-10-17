const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
//const { app, server } = require("./service/socketServer");
const { connectDB } = require("./service/dbConnect");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Middleware to parse incoming requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//app.use(express.static(path.resolve("./public")));
app.use(cookieParser());

// const init = async () => {
//   try {
//     await connectDB(); //connect to db

//     app.listen(PORT, () => {
//       console.log(`Server listening on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to intialize the server:", error);
//   }
// };
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`server started on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err}`);
  });
// init();
