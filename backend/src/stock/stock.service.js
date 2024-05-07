const stock = require("./stock.model");
const generateUniqueId = require("../common/generate-key");

const createStock = async (stockData) => {
  try {
    stockData.stockId = generateUniqueId("ST");
    const newStock = await stock.create(stockData);
    return newStock;
  } catch (error) {
    throw error;
  }
};

const getStocks = async () => {
  try {
    const stocks = await stock.find().populate("department");
    return stocks;
  } catch (error) {
    throw error;
  }
};

const getStockById = async (stockId) => {
  try {
    const stock = await stock.findById(stockId);
    return stock;
  } catch (error) {
    throw error;
  }
};

const updateStock = async (stockId, stockData) => {
  try {
    const updatedStock = await stock.findByIdAndUpdate(stockId, stockData, {
      new: true,
      runValidators: true,
    });
    return updatedStock;
  } catch (error) {
    throw error;
  }
};

const deleteStock = async (stockId) => {
  try {
    await stock.findByIdAndDelete(stockId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createStock,
  getStocks,
  getStockById,
  updateStock,
  deleteStock,
};
