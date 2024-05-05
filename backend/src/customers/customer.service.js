const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("../common/generate-key");
const Customer = require("./customer.model");

const register = async (customerData) => {
  try {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const customer = new Customer({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      password: hashedPassword,
      phone: customerData.phone,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      country: customerData.country,
      zipCode: customerData.zipCode,
    });
    customer.customerId = generateUniqueId("CUS");
    const createdCustomer = await customer.save();
    const token = jwt.sign(
      { customerId: createdCustomer._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return { createdCustomer, token };
  } catch (error) {
    throw error;
  }
};

const login = async (loginData) => {
  try {
    const customer = await Customer.findOne({
      email: loginData.email,
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      customer.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { customerId: customer._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return { customer, token };
  } catch (error) {
    throw error;
  }
};

const getCustomers = async () => {
  try {
    const customers = await Customer.find();
    return customers;
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    return customer;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (customerId, customerData) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      customerData,
      { new: true }
    );
    return updatedCustomer;
  } catch (error) {
    throw error;
  }
};

const deleteCustomer = async (customerId) => {
  try {
    await Customer.findByIdAndDelete(customerId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  register,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
