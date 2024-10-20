const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

// Map to store userId and their corresponding WebSocket connections
const userSockets = new Map();

wss.on("connection", (socket) => {
  console.log("Socket connection successful!!");

  // Generate a unique ID for each connection
  const socketId = uuidv4();
  socket.id = socketId;

  // Listen for the initial message to register the user ID with the socket
  socket.on("message", (data, isBinary) => {
    try {
      const parsedData = JSON.parse(data);
      const { sender, receiver, message } = parsedData;

      // Store the socket connection with its userId if it's not already registered
      if (message === "register" && sender && !userSockets.has(sender)) {
        userSockets.set(sender, socket);
        console.log(`User registered with ID: ${sender}`);
      }

      // Send the message to the intended receiver if the receiverId is provided
      if (receiver && userSockets.has(receiver)) {
        const receiverSocket = userSockets.get(receiver);
        if (receiverSocket.readyState === WebSocket.OPEN) {
          receiverSocket.send(JSON.stringify({ sender: sender, message }), {
            binary: isBinary,
          });
          console.log(`Message sent from ${sender} to ${receiver}`);
        }
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  });

  socket.on("error", console.error);

  socket.on("close", () => {
    // Remove the socket from the map when the connection is closed
    for (const [userId, userSocket] of userSockets.entries()) {
      if (userSocket === socket) {
        userSockets.delete(userId);
        console.log(`User with ID ${userId} disconnected`);
        break;
      }
    }
  });
});

module.exports = { server, app };
