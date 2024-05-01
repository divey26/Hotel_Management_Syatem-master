const AdditionalServicerequestService = require("./additional-service-request.service");

const createAdditionalServicerequest = async (req, res) => {
  try {
    const newAdditionalServicerequest = await AdditionalServicerequestService.createAdditionalServicerequest(req.body);
    res.status(201).json({
      success: true,
      data: newAdditionalServicerequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdditionalServicerequests = async (req, res) => {
  try {
    const AdditionalServicerequests = await AdditionalServicerequestService.getAdditionalServicerequests();
    res.status(200).json({
      success: true,
      data: AdditionalServicerequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdditionalServicerequestById = async (req, res) => {
  try {
    const AdditionalServicerequest = await AdditionalServicerequestService.getAdditionalServicerequestById(req.params.id);
    if (!AdditionalServicerequest) {
      return res.status(404).json({
        success: false,
        message: "AdditionalServicerequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: AdditionalServicerequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdditionalServicerequestsByUserId = async (req, res) => {
  try {
    const requests = await AdditionalServicerequestService.getAdditionalServiceRequestByUserId(req.params.id);
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAdditionalServicerequest = async (req, res) => {
  try {
    const updatedAdditionalServicerequest = await AdditionalServicerequestService.updateAdditionalServicerequest(
      req.params.id,
      req.body
    );
    if (!updatedAdditionalServicerequest) {
      return res.status(404).json({
        success: false,
        message: "AdditionalServicerequest not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedAdditionalServicerequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAdditionalServicerequest = async (req, res) => {
  try {
    await AdditionalServicerequestService.deleteAdditionalServicerequest(req.params.id);
    res.status(200).json({
      success: true,
      message: "AdditionalServicerequest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAdditionalServicerequest,
  getAdditionalServicerequests,
  getAdditionalServicerequestById,
  getAdditionalServicerequestsByUserId,
  updateAdditionalServicerequest,
  deleteAdditionalServicerequest,
};
