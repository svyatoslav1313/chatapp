import { roomClient } from "../http/roomClient";

const getAll = () => {
  return roomClient.get("/rooms");
};

const createRoom = (roomName, authorName) => {
  return roomClient.post("/rooms", { roomName, authorName });
};

const renameRoom = (roomId, roomName, authorName) => {
  return roomClient.patch(`/rooms/${roomId}`, {
    roomName,
    authorName,
  });
};

const deleteRoom = (roomId, authorName) => {
  return roomClient.delete(`/rooms/${roomId}`, { data: { authorName } });
};

export const roomsService = {
  getAll,
  createRoom,
  renameRoom,
  deleteRoom,
};
