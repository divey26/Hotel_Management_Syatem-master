const supplierService = require("./supplier.service");

const createSupplier = async (req, res) => {
  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
      success: true,
      data: newSupplier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      data: Supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await supplierService.updateSupplier(
      req.params.id,
      req.body
    );
    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedSupplier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
