const Room = require("./rooms.model");
const { getBookedRooms } = require("../booking/booking.service");
const generateUniqueId = require("../common/generate-key");

const createRoom = async (roomData) => {
  try {
    roomData.roomId = generateUniqueId("ROOM")
    const newRoom = await Room.create(roomData);
    return newRoom;
  } catch (error) {
    throw error;
  }
};

const getRooms = async () => {
  try {
    const rooms = await Room.find();
    return rooms;
  } catch (error) {
    throw error;
  }
};

const getRoomById = async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    return room;
  } catch (error) {
    throw error;
  }
};

const updateRoom = async (roomId, roomData) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(roomId, roomData, {
      new: true,
      runValidators: true,
    });
    return updatedRoom;
  } catch (error) {
    throw error;
  }
};

const deleteRoom = async (roomId) => {
  try {
    await Room.findByIdAndDelete(roomId);
  } catch (error) {
    throw error;
  }
};

const getAvailableRooms = async (checkInDate, checkOutDate, noOfPersons) => {
  try {
    const bookedRooms = await getBookedRooms(checkInDate, checkOutDate);
    const availableRooms = await Room.find({
      _id: { $nin: bookedRooms.map((room) => room._id) },
    });
    const filteredRooms = availableRooms.filter(
      (room) => room.capacity >= noOfPersons
    );
    return filteredRooms;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
};
