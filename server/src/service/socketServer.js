const express = require("express");
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const app = express();
const server = app.listen(8000);

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.on("error", console.error);

  socket.on("message", (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary }); //broadcast message
      }
    });
  });
  console.log("Socket connection successful!!");
  socket.send("Hello! Message from server!!");
});

module.exports = { server, app };
