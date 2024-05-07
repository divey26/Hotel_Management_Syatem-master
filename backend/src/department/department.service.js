const department = require("./department.model");
const generateUniqueId = require("../common/generate-key");

const createDepartment = async (departmentData) => {
  try {
    departmentData.departmentId = generateUniqueId("DEP")
    const newDepartment = await department.create(departmentData);
    return newDepartment;
  } catch (error) {
    throw error;
  }
};

const getDepartments = async () => {
  try {
    const departments = await department.find();
    return departments;
  } catch (error) {
    throw error;
  }
};

const getDepartmentById = async (departmentId) => {
  try {
    const department = await department.findById(departmentId);
    return department;
  } catch (error) {
    throw error;
  }
};

const updateDepartment = async (departmentId, departmentData) => {
  try {
    const updatedDepartment = await department.findByIdAndUpdate(
      departmentId,
      departmentData,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedDepartment;
  } catch (error) {
    throw error;
  }
};

const deleteDepartment = async (departmentId) => {
  try {
    await department.findByIdAndDelete(departmentId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
