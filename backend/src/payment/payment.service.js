const Payment = require("./payment.model");

const createPayment = async (paymentData) => {
  try {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  } catch (error) {
    throw error;
  }
};

const getPayments = async () => {
  try {
    const payments = await Payment.find().populate("user").populate("booking").populate("order");
    return payments;
  } catch (error) {
    throw error;
  }
};

const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId).populate("user");
    return payment;
  } catch (error) {
    throw error;
  }
};

const updatePayment = async (paymentId, paymentData) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      paymentData,
      { new: true }
    );
    return updatedPayment;
  } catch (error) {
    throw error;
  }
};

const deletePayment = async (paymentId) => {
  try {
    await Payment.findByIdAndDelete(paymentId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPayment,
  getPayments,
  updatePayment,
  getPaymentById,
  deletePayment,
};
