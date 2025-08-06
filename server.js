import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import "dotenv/config";
import { handleChatJoin, handleChatMessage, handleChatLeave, handleChatDisconnect } from "./helpers/socketHandler/chatHandlers.js";
import { handleTicTacToeJoin, handleTicTacToeMove, handleTicTacToeLeave, handleTicTacToeDisconnect, handleTicTacToeReset } from "./helpers/socketHandler/tictactoeHandlers.js";
import { handleIceCandidate, handleVoiceAnswer, handleVoiceJoin, handleVoiceOffer, handleVoiceLeave } from "./helpers/socketHandler/voiceHandler.js";
import { handleRPSJoin, handleRPSChoice, handleRPSNextRound, handleRPSReset, handleRPSLeave, handleRPSDisconnect } from "./helpers/socketHandler/rpsHandler.js";

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
    socket.on("voice:join", (data) => handleVoiceJoin(socket, data,chatMap));
    socket.on('voice:offer',(data)=>handleVoiceOffer(data,socket,io));
    socket.on('voice:answer',(data)=>handleVoiceAnswer(data,socket,io));
    socket.on("voice:ice-candidate", (data) => handleIceCandidate(data,socket,io));
    socket.on('voice:leave', (data) => handleVoiceLeave(socket, data, chatMap));
    socket.on('tictactoe:join', (data) => handleTicTacToeJoin(io, gameMap, data));
    socket.on('tictactoe:move', (data) => handleTicTacToeMove(io, gameMap, data));
    socket.on('tictactoe:reset',(data)=>handleTicTacToeReset(io,data,gameMap));
    socket.on('tictactoe:leave', (data) => handleTicTacToeLeave(io, gameMap, data));
    socket.on('rps:join', (data) => handleRPSJoin(io, gameMap, data));
    socket.on('rps:choice', (data) => handleRPSChoice(io, gameMap, data));
    socket.on('rps:next-round', (data) => handleRPSNextRound(io, gameMap, data));
    socket.on('rps:reset', (data) => handleRPSReset(io, gameMap, data));
    socket.on('rps:leave', (data) => handleRPSLeave(io, gameMap, data));
    socket.on('disconnect',()=>{
      handleChatDisconnect(io,socket,chatMap,chathistoryMap);
      handleTicTacToeDisconnect(io, socket, gameMap);
      handleRPSDisconnect(io, socket, gameMap);
      if(socket.gameName && socket.roomCode){
        handleVoiceLeave(socket, { gameName: socket.gameName, roomCode: socket.roomCode }, chatMap);
      }
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