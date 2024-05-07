const MenuItem = require("./menu.model");
const generateUniqueId = require("../common/generate-key");

const createMenuItem = async (menuItemData) => {
  try {
    menuItemData.menuId = generateUniqueId("ME");
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    return menuItem;
  } catch (error) {
    throw error;
  }
};

const getMenuItems = async () => {
  try {
    const menuItems = await MenuItem.find();
    return menuItems;
  } catch (error) {
    throw error;
  }
};

const getMenuItemById = async (menuItemId) => {
  try {
    const menuItem = await MenuItem.findById(menuItemId);
    return menuItem;
  } catch (error) {
    throw error;
  }
};

const updateMenuItem = async (menuItemId, menuItemData) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      menuItemData,
      { new: true }
    );
    return updatedMenuItem;
  } catch (error) {
    throw error;
  }
};

const deleteMenuItem = async (menuItemId) => {
  try {
    await MenuItem.findByIdAndDelete(menuItemId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  getMenuItemById,
  deleteMenuItem,
};
