import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 }); // Change to 8081 or another available port

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
});

export const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export default wss;
