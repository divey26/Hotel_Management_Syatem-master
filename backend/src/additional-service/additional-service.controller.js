const AdditionalServiceService = require("./additional-service.service");

const createAdditionalService = async (req, res) => {
  try {
    const newAdditionalService = await AdditionalServiceService.createAdditionalService(req.body);
    res.status(201).json({
      success: true,
      data: newAdditionalService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdditionalServices = async (req, res) => {
  try {
    const AdditionalServices = await AdditionalServiceService.getAdditionalServices();
    res.status(200).json({
      success: true,
      data: AdditionalServices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdditionalServiceById = async (req, res) => {
  try {
    const AdditionalService = await AdditionalServiceService.getAdditionalServiceById(req.params.id);
    if (!AdditionalService) {
      return res.status(404).json({
        success: false,
        message: "AdditionalService not found",
      });
    }
    res.status(200).json({
      success: true,
      data: AdditionalService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAdditionalService = async (req, res) => {
  try {
    const updatedAdditionalService = await AdditionalServiceService.updateAdditionalService(
      req.params.id,
      req.body
    );
    if (!updatedAdditionalService) {
      return res.status(404).json({
        success: false,
        message: "AdditionalService not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedAdditionalService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAdditionalService = async (req, res) => {
  try {
    await AdditionalServiceService.deleteAdditionalService(req.params.id);
    res.status(200).json({
      success: true,
      message: "AdditionalService deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAdditionalService,
  getAdditionalServices,
  getAdditionalServiceById,
  updateAdditionalService,
  deleteAdditionalService,
};
