const { DB_NAME } = require("../constants");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected!! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
