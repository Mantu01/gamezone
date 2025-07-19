import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "dotenv/config";
import { handleChatJoin, handleChatMessage, handleChatLeave, handleChatDisconnect } from "./helpers/socketHandler/chatHandlers.js";
import { handleTicTacToeJoin, handleTicTacToeMove, handleTicTacToeLeave, handleTicTacToeDisconnect, handleTicTacToeReset } from "./helpers/socketHandler/tictactoeHandlers.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST;
const port = process.env.PORT;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  
  const chatMap = new Map();
  const chathistoryMap=new Map();
  const gameMap=new Map()

  io.on("connection", (socket) => {
    socket.on("chat:join", (user) => handleChatJoin(io, socket, chatMap, user,chathistoryMap));
    socket.on("chat:message", (msgData) => handleChatMessage(io, msgData,chathistoryMap));
    socket.on('chat:leave',(data)=>handleChatLeave(io,chatMap,data));
    socket.on('tictactoe:join', (data) => handleTicTacToeJoin(io, gameMap, data));
    socket.on('tictactoe:move', (data) => handleTicTacToeMove(io, gameMap, data));
    socket.on('tictactoe:reset',(data)=>handleTicTacToeReset(io,data,gameMap));
    socket.on('tictactoe:leave', (data) => handleTicTacToeLeave(io, gameMap, data));
    socket.on('disconnect',()=>{
      handleChatDisconnect(io,socket,chatMap,chathistoryMap);
      handleTicTacToeDisconnect(io, socket, gameMap);
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