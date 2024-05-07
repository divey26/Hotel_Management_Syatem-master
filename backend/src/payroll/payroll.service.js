const Payroll = require("./payroll.model");
const generateUniqueId = require("../common/generate-key");

const createPayroll = async (payrollData) => {
  try {
    payrollData.payrollId = generateUniqueId("PR");
    const payroll = new Payroll(payrollData);
    await payroll.save();
    return payroll;
  } catch (error) {
    throw error;
  }
};

const getPayrolls = async () => {
  try {
    const payrolls = await Payroll.find();
    return payrolls;
  } catch (error) {
    throw error;
  }
};

const getPayrollById = async (payrollId) => {
  try {
    const payroll = await Payroll.findById(payrollId);
    return payroll;
  } catch (error) {
    throw error;
  }
};

const updatePayroll = async (payrollId, payrollData) => {
  try {
    const updatedPayroll = await Payroll.findByIdAndUpdate(payrollId, payrollData, {
      new: true,
    });
    return updatedPayroll;
  } catch (error) {
    throw error;
  }
};

const deletePayroll = async (payrollId) => {
  try {
    await Payroll.findByIdAndDelete(payrollId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};
