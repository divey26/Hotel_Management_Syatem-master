const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const roomRoutes = require("./src/rooms/rooms.routes");
const feedbackRoutes = require("./src/CustomerAffair/Feedback/FeedbackRoute");
const complaintRoutes = require("./src/CustomerAffair/Complaint/ComplaintRoute"); 
const userRoutes = require("./src/users/users.routes");
const employeeRoutes = require("./src/employees/employee.routes");
const customerRoutes = require("./src/customers/customer.routes");
const bookingRoutes = require("./src/booking/booking.routes");
const paymentsRoutes = require("./src/payment/payment.routes");
const menuRoutes = require("./src/menu/menu.routes");
const orderRoutes = require("./src/food-order/order.routes");
const departmentRoutes = require("./src/department/department.routes");
const stockRoutes = require("./src/stock/stock.routes");
const supplierRoutes = require("./src/supplier/supplier.routes");
const driverRoutes = require("./src/driver/driver.routes");
const vehicleRoutes = require("./src/vehicle/vehicle.routes");
const travelRequestsRoutes = require("./src/travel-request/travel-request.routes");
const eventLocationsRoutes = require("./src/event-location/event-location.routes");
const eventRoutes = require("./src/events/event.routes");
const eventRequestsRoutes = require("./src/event-request/event-request.routes");
const attendanceRoutes = require("./src/attendance/attendance.routes");
const leaveRequestRoutes = require("./src/leave-request/leave-request.routes");
const payrollRoutes = require("./src/payroll/payroll.routes");
const additionalServicesRoutes = require("./src/additional-service/additional-service.routes");
const additionalServiceRequestsRoutes = require("./src/additional-service-request/additional-service-request.routes");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/travel-requests", travelRequestsRoutes);
app.use("/api/event-locations", eventLocationsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave-request", leaveRequestRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/event-requests", eventRequestsRoutes);
app.use("/api/additional-services", additionalServicesRoutes);
app.use("/api/additional-service-requests", additionalServiceRequestsRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
