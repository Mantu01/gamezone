export function handleVoiceJoin(socket, data,chatMap) {
  const {roomCode,gameName}=data;
  if(!chatMap?.get(gameName || !chatMap.get(gameName)?.get(roomCode)))  return ;
  const allUsers=[...chatMap.get(gameName).get(roomCode).values()];
  allUsers.forEach(({socketId})=>{
    socket.to(socketId).emit('voice:new-peer',{peerId:socket.id});
    socket.emit('voice:new-peer',{peerId:socketId});
  });
}

export function handleVoiceOffer(data,socket,io){
  const {to,offer}=data;
  io.to(to).emit("voice:offer", { from: socket.id, offer });
}

export function handleVoiceAnswer(data,socket,io){
  const {to,answer}=data;
  io.to(to).emit("voice:answer", { from: socket.id, answer });
}

export function handleIceCandidate(data,socket,io){
  const {to,candidate}=data;
  io.to(to).emit("voice:ice-candidate", { from: socket.id, candidate });
}