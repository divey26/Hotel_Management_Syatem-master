const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./users.model');

const register = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      userType: userData.userType,
      employee: userData.employee
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const login = async (loginData) => {
  try {
    const user = await User.findOne({ username: loginData.username });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login
};
