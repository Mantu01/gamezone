import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "dotenv/config";
import { handleChatJoin, handleChatMessage, handleChatLeave } from "./helpers/socketHandler/chatHandlers.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST;
const port = process.env.PORT;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const gameMap = new Map();

  io.on("connection", (socket) => {
    socket.on("chat:join", (user) => handleChatJoin(io, socket, gameMap, user));
    socket.on("chat:message", (msg) => handleChatMessage(io, msg));
    socket.on('chat:leave',(data)=>handleChatLeave(io,gameMap,data));
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