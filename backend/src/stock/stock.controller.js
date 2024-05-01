const stockService = require("./stock.service");

const createStock = async (req, res) => {
  try {
    const newStock = await stockService.createStock(req.body);
    res.status(201).json({
      success: true,
      data: newStock,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStocks = async (req, res) => {
  try {
    const stocks = await stockService.getStocks();
    res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStockById = async (req, res) => {
  try {
    const stock = await stockService.getStockById(req.params.id);
    if (!Stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }
    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const updatedStock = await stockService.updateStock(
      req.params.id,
      req.body
    );
    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedStock,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    await stockService.deleteStock(req.params.id);
    res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStock,
  getStocks,
  getStockById,
  updateStock,
  deleteStock,
};
