export function handleChatJoin(io, socket, gameMap, user) {
  const {id,username,pic,roomCode,gameName}=user;
  if(!gameMap.has(gameName)){
    gameMap.set(gameName,new Map())
  }
  const roomMap=gameMap.get(gameName)
  if(!roomMap.has(roomCode)){
    roomMap.set(roomCode,new Map())
  }
  const userData={id,socketId:socket.id,username,pic}
  roomMap.get(roomCode).set(id,userData);
  io.emit(`chat:${gameName}:${roomCode}:users`,[...gameMap.get(gameName).get(roomCode).values()]);
}

export function handleChatMessage(io, msg) {
  io.emit("chat:message", msg);
}

export function handleChatLeave(io,gameMap,data){
  const {id,roomCode,gameName}=data; 
  const roomMap=gameMap.get(gameName)
  if(!roomMap)  return ;
  const userMap=roomMap.get(roomCode);
  if(!userMap)  return;
  userMap.delete(id)
  io.emit(`chat:${gameName}:${roomCode}:users`,[...userMap.values()]);
}