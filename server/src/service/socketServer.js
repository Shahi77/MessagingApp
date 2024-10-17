const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");

const app = express();
const PORT = process.env.PORT || 8000;
const server = app.listen(8000, () => {
  console.log(`Server starting on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Socket connection successful!!");
  socket.send("Hello! Message from server!!");

  socket.on("error", console.error);

  socket.on("message", (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary }); //broadcast message
      }
    });
  });
});

module.exports = { server, app };
