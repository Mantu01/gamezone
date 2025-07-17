import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "dotenv/config";
import { handleChatJoin, handleChatMessage, handleChatLeave, handleChatDisconnect } from "./helpers/socketHandler/chatHandlers.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST;
const port = process.env.PORT;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  
  const gameMap = new Map();
  const chathistoryMap=new Map();

  io.on("connection", (socket) => {
    socket.on("chat:join", (user) => handleChatJoin(io, socket, gameMap, user,chathistoryMap));
    socket.on("chat:message", (msgData) => handleChatMessage(io, msgData,chathistoryMap));
    socket.on('chat:leave',(data)=>handleChatLeave(io,gameMap,data));
    socket.on('disconnect',()=>{
      handleChatDisconnect(io,socket,gameMap,chathistoryMap);
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