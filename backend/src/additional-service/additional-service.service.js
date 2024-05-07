const AdditionalService = require("./addtional-service.model");
const generateUniqueId = require("../common/generate-key");

const createAdditionalService = async (data) => {
  try {
    data.serviceId = generateUniqueId("ADS");
    const newAdditionalService = await AdditionalService.create(
      data
    );
    return newAdditionalService;
  } catch (error) {
    throw error;
  }
};

const getAdditionalServices = async () => {
  try {
    const AdditionalServices = await AdditionalService.find();
    return AdditionalServices;
  } catch (error) {
    throw error;
  }
};

const getAdditionalServiceById = async (serviceId) => {
  try {
    const AdditionalService = await AdditionalService.findById(
      serviceId
    );
    return AdditionalService;
  } catch (error) {
    throw error;
  }
};

const updateAdditionalService = async (
  serviceId,
  data
) => {
  try {
    const updatedAdditionalService =
      await AdditionalService.findByIdAndUpdate(
        serviceId,
        data,
        {
          new: true,
          runValidators: true,
        }
      );
    return updatedAdditionalService;
  } catch (error) {
    throw error;
  }
};

const deleteAdditionalService = async (serviceId) => {
  try {
    await AdditionalService.findByIdAndDelete(
      serviceId
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAdditionalService,
  getAdditionalServices,
  getAdditionalServiceById,
  updateAdditionalService,
  deleteAdditionalService,
};
