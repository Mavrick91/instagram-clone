import { WebSocketServer } from "ws";

import { ThreadMessage } from "@/types/thread";

const wss = new WebSocketServer({ port: 8081 }); // Change to 8081 or another available port

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("received: %s", data);
  });
});

export const broadcastMessage = (event: {
  type: "messageAdded";
  message: ThreadMessage;
}) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
};

export default wss;
