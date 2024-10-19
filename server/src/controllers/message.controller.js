const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const handleSendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const receiverId = req.params.receiverId;
  const senderId = req.user.id;
  //const currentDate = new Date().toISOString();

  // Create a new message
  const newMessage = new Message({
    sender: senderId,
    receiver: receiverId,
    message: message,
  });
  // Save message to MongoDB
  await newMessage.save();

  //Find or create a chat
  let chat = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!chat) {
    // If no chat exists, create a new one
    chat = new Chat({
      participants: [senderId, receiverId],
      messages: [newMessage._id],
    });
  } else {
    // If chat exists, push the new message
    chat.messages.push(newMessage._id);
  }

  // Save the chat document
  await chat.save();

  // Return response with the new message
  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent and added to chat"));
});

const handleGetMessage = asyncHandler(async (req, res) => {
  const receiverId = req.params.receiverId;
  const senderId = req.user.id;

  // Find the chat between the sender and receiver
  const chat = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages"); // Populate messages

  if (!chat) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No chat found between the users"));
  }

  const messages = chat.messages.sort((a, b) => a.createdAt - b.createdAt);
  return res
    .status(200)
    .json(new ApiResponse(200, { messages }, "Messages fetched successfully"));
});

module.exports = { handleSendMessage, handleGetMessage };
