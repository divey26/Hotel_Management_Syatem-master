const roomService = require("./rooms.service");

const createRoom = async (req, res) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json({
      success: true,
      data: newRoom,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getRooms();
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedRoom,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, noOfPersons } = req.body;
    const rooms = await roomService.getAvailableRooms(
      checkInDate,
      checkOutDate,
      noOfPersons
    );
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
