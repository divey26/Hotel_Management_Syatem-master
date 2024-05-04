const AdditionalServicerequest = require("./additional-service-request.model");
const generateUniqueId = require("../common/generate-key");

const createAdditionalServicerequest = async (data) => {
  try {
    data.requestId = generateUniqueId("ADSR");
    const newAdditionalServicerequest = await AdditionalServicerequest.create(
      data
    );
    return newAdditionalServicerequest;
  } catch (error) {
    throw error;
  }
};

const getAdditionalServicerequests = async () => {
  try {
    const AdditionalServicerequests = await AdditionalServicerequest.find()
      .populate("user")
      .populate("service");
    return AdditionalServicerequests;
  } catch (error) {
    throw error;
  }
};

const getAdditionalServicerequestById = async (AdditionalServicerequestId) => {
  try {
    const AdditionalServicerequest = await AdditionalServicerequest.findById(
      AdditionalServicerequestId
    );
    return AdditionalServicerequest;
  } catch (error) {
    throw error;
  }
};

const getAdditionalServiceRequestByUserId = async (userId) => {
  try {
    const bookings = await AdditionalServicerequest.find({ user: userId })
      .populate("user")
      .populate("service");
    return bookings;
  } catch (error) {
    throw error;
  }
};

const updateAdditionalServicerequest = async (
  AdditionalServicerequestId,
  AdditionalServicerequestData
) => {
  try {
    const updatedAdditionalServicerequest =
      await AdditionalServicerequest.findByIdAndUpdate(
        AdditionalServicerequestId,
        AdditionalServicerequestData,
        {
          new: true,
          runValidators: true,
        }
      );
    return updatedAdditionalServicerequest;
  } catch (error) {
    throw error;
  }
};

const deleteAdditionalServicerequest = async (AdditionalServicerequestId) => {
  try {
    await AdditionalServicerequest.findByIdAndDelete(
      AdditionalServicerequestId
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAdditionalServicerequest,
  getAdditionalServicerequests,
  getAdditionalServicerequestById,
  getAdditionalServiceRequestByUserId,
  updateAdditionalServicerequest,
  deleteAdditionalServicerequest,
};
