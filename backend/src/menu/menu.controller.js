const menuItemService = require("./menu.service");

const createMenuItem = async (req, res) => {
  try {
    const newMenuItem = await menuItemService.createMenuItem(req.body);
    res.status(201).json({
      success: true,
      data: newMenuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await menuItemService.getMenuItems();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuItemService.getMenuItemById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await menuItemService.updateMenuItem(
      req.params.id,
      req.body
    );
    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "MenuItem not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    await menuItemService.deleteMenuItem(req.params.id);
    res.status(200).json({
      success: true,
      message: "MenuItem deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
