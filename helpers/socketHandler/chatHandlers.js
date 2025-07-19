export function handleChatJoin(io, socket, chatMap, user,chathistoryMap) {
  const {id,username,pic,roomCode,gameName}=user;
  if(!chatMap.has(gameName)){
    chatMap.set(gameName,new Map())
  }
  if(!chathistoryMap.has(gameName)){
    chathistoryMap.set(gameName,new Map())
  }
  const chatRoomMap=chathistoryMap.get(gameName);
  const roomMap=chatMap.get(gameName)
  if(!roomMap.has(roomCode)){
    roomMap.set(roomCode,new Map())
  }
  if(!chatRoomMap.has(roomCode)){
    chatRoomMap.set(roomCode,[])
  }
  const allChats=chatRoomMap.get(roomCode)
  const userData={id,socketId:socket.id,username,pic}
  roomMap.get(roomCode).set(id,userData);
  io.emit(`chat:${gameName}:${roomCode}:users`,[...chatMap.get(gameName).get(roomCode).values()]);
  io.to(socket.id).emit("chat:history",allChats);
}

export function handleChatMessage(io, msgData,chathistoryMap) {
  const {msg,roomCode,gameName}=msgData;
  chathistoryMap.get(gameName).get(roomCode).push(msg)
  io.emit(`chat:${gameName}:${roomCode}:message`, msg);
}

export function handleChatLeave(io,chatMap,data){
  const {id,roomCode,gameName}=data; 
  const roomMap=chatMap.get(gameName)
  if(!roomMap)  return ;
  const userMap=roomMap.get(roomCode);
  if(!userMap)  return;
  userMap.delete(id)
  io.emit(`chat:${gameName}:${roomCode}:users`,[...userMap.values()]);
}

export function handleChatDisconnect(io, socket, chatMap,chathistoryMap) {
  let foundGame = null;
  let foundRoom = null;
  for (const [gameName, roomMap] of chatMap) {
    for (const [roomCode, usersMap] of roomMap) {
      for (const [userId, userData] of usersMap) {
        if (userData.socketId === socket.id) {
          usersMap.delete(userId);
          foundGame = gameName;
          foundRoom = roomCode;
          if (usersMap.size === 0){
            roomMap.delete(roomCode);
            chathistoryMap.get(gameName).delete(roomCode);
          }
          if (roomMap.size === 0){
            chatMap.delete(gameName);
            chathistoryMap.delete(gameName);
          }
          break;
        }
      }
      if (foundRoom) break;
    }
    if (foundGame) break;
  }
  if (foundGame && foundRoom) {
    const roomUsers =chatMap.get(foundGame)?.get(foundRoom) ?? null;
    io.emit(`chat:${foundGame}:${foundRoom}:users`,roomUsers ? [...roomUsers.values()] : []);
  }
}