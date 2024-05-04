const PaymentService = require("./payment.service");

const createPayment = async (req, res) => {
  try {
    const payment = await PaymentService.createPayment(req.body);
    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await PaymentService.getPayments();
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentsForBookings = async (req, res) => {
  try {
    const payments = await PaymentService.getPaymentsForBookings();
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: Payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await PaymentService.updatePayment(
      req.params.id,
      req.body
    );
    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    await PaymentService.deletePayment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentsForBookings,
  updatePayment,
  getPaymentById,
  deletePayment,
};
