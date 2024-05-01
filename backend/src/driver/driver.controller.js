const driverService = require("./driver.service");

const createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getDrivers();
    res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const updatedDriver = await driverService.updateDriver(
      req.params.id,
      req.body
    );
    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedDriver,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
