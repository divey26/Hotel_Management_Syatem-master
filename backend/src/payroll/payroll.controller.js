const payrollService = require("./payroll.service");

const createPayroll = async (req, res) => {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    res.status(201).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayrolls = async (req, res) => {
  try {
    const payrolls = await payrollService.getPayrolls();
    res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayrollById = async (req, res) => {
  try {
    const payroll = await payrollService.getPayrollById(req.params.id);
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }
    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePayroll = async (req, res) => {
  try {
    const updatedPayroll = await payrollService.updatePayroll(
      req.params.id,
      req.body
    );
    if (!updatedPayroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedPayroll,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePayroll = async (req, res) => {
  try {
    await payrollService.deletePayroll(req.params.id);
    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};
