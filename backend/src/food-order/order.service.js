const Order = require("./order.model");
const generateUniqueId = require("../common/generate-key");

const createOrder = async (orderData) => {
  try {
    orderData.orderId = generateUniqueId("ORD")
    const order = new Order(orderData);
    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

const getOrders = async () => {
  try {
    const orders = await Order.find().populate("user");
    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    throw error;
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ user: userId }).populate("user");
    return orders;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async (orderId, orderData) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, orderData, {
      new: true,
    });
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async (orderId) => {
  try {
    await Order.findByIdAndDelete(orderId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUserId,
  updateOrder,
  getOrderById,
  deleteOrder,
};
