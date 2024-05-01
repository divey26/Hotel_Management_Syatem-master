const userService = require('./users.service');

const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await userService.login(req.body);
    res.status(200).json({
      success: true,
      data: user,
      token
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};
