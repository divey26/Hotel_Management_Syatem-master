const Employee = require('./employee.model');

const createEmployee = async (employeeData) => {
  try {
    const employee = new Employee(employeeData);
    await employee.save();
    return employee;
  } catch (error) {
    throw error;
  }
};

const getEmployees = async () => {
  try {
    const employees = await Employee.find();
    return employees;
  } catch (error) {
    throw error;
  }
};

const getEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    return employee;
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (employeeId, employeeData) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, employeeData, { new: true });
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    await Employee.findByIdAndDelete(employeeId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
