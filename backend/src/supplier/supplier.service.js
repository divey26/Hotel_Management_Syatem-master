const supplier = require("./supplier.model");
const generateUniqueId = require("../common/generate-key");

const createSupplier = async (supplierData) => {
  try {
    supplierData.supplierId = generateUniqueId("SUP")
    const newSupplier = await supplier.create(supplierData);
    return newSupplier;
  } catch (error) {
    throw error;
  }
};

const getSuppliers = async () => {
  try {
    const suppliers = await supplier.find();
    return suppliers;
  } catch (error) {
    throw error;
  }
};

const getSupplierById = async (supplierId) => {
  try {
    const supplier = await supplier.findById(supplierId);
    return supplier;
  } catch (error) {
    throw error;
  }
};

const updateSupplier = async (supplierId, supplierData) => {
  try {
    const updatedSupplier = await supplier.findByIdAndUpdate(supplierId, supplierData, {
      new: true,
      runValidators: true,
    });
    return updatedSupplier;
  } catch (error) {
    throw error;
  }
};

const deleteSupplier = async (supplierId) => {
  try {
    await supplier.findByIdAndDelete(supplierId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
