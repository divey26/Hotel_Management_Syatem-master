const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./users.model");
const employeeService = require("../employees/employee.service");

const generateUniqueId = require("../common/generate-key");

const register = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    let createdUser = null
    if(userData.employee){
      const employee = await employeeService.getOneByEmployeeId(
        userData.employee
      );

      if(!employee){
        throw new Error("Invalid Employee!");
      }
  
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        userType: userData.userType,
        employee: employee._id,
      });
      user.userId = generateUniqueId("USR");
      createdUser = await user.save();
    }else{
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        userType: userData.userType,
      });
      user.userId = generateUniqueId("USR");
      createdUser = await user.save();
    }

    const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { createdUser, token };

  } catch (error) {
    throw error;
  }
};

const login = async (loginData) => {
  try {
    const user = await User.findOne({ username: loginData.username });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { user, token };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
};
