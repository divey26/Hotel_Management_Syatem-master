const Driver = require("./driver.model");
const generateUniqueId = require("../common/generate-key");

const createDriver = async (driverData) => {
  try {
    driverData.driverId = generateUniqueId("DRI");
    const driver = new Driver(driverData);
    await driver.save();
    return driver;
  } catch (error) {
    throw error;
  }
};

const getDrivers = async () => {
  try {
    const drivers = await Driver.find();
    return drivers;
  } catch (error) {
    throw error;
  }
};

const getDriverById = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);
    return driver;
  } catch (error) {
    throw error;
  }
};

const updateDriver = async (driverId, driverData) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, driverData, {
      new: true,
    });
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};

const deleteDriver = async (driverId) => {
  try {
    await Driver.findByIdAndDelete(driverId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
