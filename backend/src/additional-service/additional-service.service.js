const AdditionalService = require("./addtional-service.model");

const createAdditionalService = async (AdditionalServiceData) => {
  try {
    const newAdditionalService = await AdditionalService.create(
      AdditionalServiceData
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

const getAdditionalServiceById = async (AdditionalServiceId) => {
  try {
    const AdditionalService = await AdditionalService.findById(
      AdditionalServiceId
    );
    return AdditionalService;
  } catch (error) {
    throw error;
  }
};

const updateAdditionalService = async (
  AdditionalServiceId,
  AdditionalServiceData
) => {
  try {
    const updatedAdditionalService =
      await AdditionalService.findByIdAndUpdate(
        AdditionalServiceId,
        AdditionalServiceData,
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

const deleteAdditionalService = async (AdditionalServiceId) => {
  try {
    await AdditionalService.findByIdAndDelete(
      AdditionalServiceId
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
