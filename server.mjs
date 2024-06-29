// server.ts
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    path: "/api/socketio",
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Invalid user ID"));
    }
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.userId);

    socket.join(socket.userId);

    socket.on("chat message", ({ recipientId, senderId, message }) => {
      console.log("😀😀 recipientId ~ ", recipientId);
      io.to(recipientId).emit("chat message", message);
      io.to(senderId).emit("chat message", message);
    });

    socket.on("notification", ({ recipientId, notification }) => {
      io.to(recipientId).emit("notification", notification);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.userId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
