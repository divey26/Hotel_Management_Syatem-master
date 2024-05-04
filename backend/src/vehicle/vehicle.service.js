const Vehicle = require("./vehicle.model");
const generateUniqueId = require("../common/generate-key");

const createVehicle = async (vehicleData) => {
  try {
    vehicleData.vehicleId = generateUniqueId("VEH");
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    return Vehicle;
  } catch (error) {
    throw error;
  }
};

const getVehicles = async () => {
  try {
    const vehicles = await Vehicle.find();
    return vehicles;
  } catch (error) {
    throw error;
  }
};

const getVehicleById = async (vehicleId) => {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    return vehicle;
  } catch (error) {
    throw error;
  }
};

const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      vehicleData,
      {
        new: true,
      }
    );
    return updatedVehicle;
  } catch (error) {
    throw error;
  }
};

const deleteVehicle = async (vehicleId) => {
  try {
    await Vehicle.findByIdAndDelete(vehicleId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
