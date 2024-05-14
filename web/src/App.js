import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Auth/login";
import Register from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/reset-password";
import Dashboard from "./DashBoard/Dashboard";
import Room from "./RoomReservation/Room";
import Bookings from "./RoomReservation/Bookings";
import RoomPayments from "./RoomReservation/RoomPayments";
import MenuManagementPage from "./Restaurant/Menus";
import OrdersPage from "./Restaurant/Orders";
import OrderProcessingPage from "./Restaurant/OrderProcessingTracking";
import SupplierManagementPage from "./Department/Supplier";
import StockManagementPage from "./Department/Stock";
import DepartmentManagementPage from "./Department/Department";
import EmployeeManagementPage from "./Employee/Employee";
import AttendanceManagementPage from "./Employee/Attendance";
import PayrollPage from "./Employee/Payroll";
import LeaveTrackingPage from "./Employee/LeaveTracking";
import EventManagementPage from "./Events/Events";
import EventRequestManagementPage from "./Events/EventRequest";
import VehicleManagementPage from "./Transport/Vehicle";
import DriverManagementPage from "./Transport/Driver";
import TrackDelivery from "./Transport/TrackDelivery";
import TravelRequestsManagementPage from "./Transport/TravelRequests";
import AdditionalServiceRequestManagementPage from "./AdditionalService/AdditionalServiceRequest";
import AdditionalServiceManagementPage from "./AdditionalService/AdditionalService";
import EventLocationManagementPage from "./Events/EventLocations";
import Payments from "./PaymentsAndIncoice/Payments";
import Summa from "./Department/summa";
import Scanner from "./Department/Scanner";
import DetailsPage from "./Department/Details";
import FeedbackTablePage from "./Feedback/Feedback";
import UpdateFeedbackPage from "./Feedback/UpdateFeedback";
import ComplaintsTablePage from "./Complaint/Complaint";
import UpdateComplaintPage from "./Complaint/UpdateComplaint";

function App() {
  const storedAuthToken = localStorage.getItem("authToken");
  const storedUserType = localStorage.getItem("loggedInUserType");

  const isAdminAuthenticated = () => {
    return true;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details/:scannedValue" element={<DetailsPage />} />
        {/* room reservation */}
        <Route
          path="/rooms"
          element={isAdminAuthenticated() ? <Room /> : <Navigate to="/" />}
        />
        <Route
          path="/bookings"
          element={isAdminAuthenticated() ? <Bookings /> : <Navigate to="/" />}
        />
        <Route
          path="/room/payments"
          element={
            isAdminAuthenticated() ? <RoomPayments /> : <Navigate to="/" />
          }
        />

        {/* menu management */}
        <Route
          path="/menus"
          element={
            isAdminAuthenticated() ? (
              <MenuManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAdminAuthenticated() ? <OrdersPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/orderTracking"
          element={
            isAdminAuthenticated() ? (
              <OrderProcessingPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* inventory management */}
        <Route
          path="/departments"
          element={
            isAdminAuthenticated() ? (
              <DepartmentManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/stocks"
          element={
            isAdminAuthenticated() ? (
              <StockManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/suppliers"
          element={
            isAdminAuthenticated() ? (
              <SupplierManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
         <Route
          path="/rfid"
          element={
            isAdminAuthenticated() ? (
              <Summa />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/qwe"
          element={
            isAdminAuthenticated() ? (
              <Scanner />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/det"
          element={
            isAdminAuthenticated() ? (
              <DetailsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />


        {/* employee management */}
        <Route
          path="/employee"
          element={
            isAdminAuthenticated() ? (
              <EmployeeManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/attendance" element={<AttendanceManagementPage />} />
        <Route
          path="/payroll"
          element={
            isAdminAuthenticated() ? <PayrollPage /> : <Navigate to="/" />
          }
        />
        <Route path="/leaveTracking" element={<LeaveTrackingPage />} />

        {/* events management */}
        <Route
          path="/events"
          element={
            isAdminAuthenticated() ? (
              <EventManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/event-requests"
          element={
            isAdminAuthenticated() ? (
              <EventRequestManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/event-locations"
          element={
            isAdminAuthenticated() ? (
              <EventLocationManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* transport management */}
        <Route
          path="/drivers"
          element={
            isAdminAuthenticated() ? (
              <DriverManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/vehicles"
          element={
            isAdminAuthenticated() ? (
              <VehicleManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/transports"
          element={
            isAdminAuthenticated() ? (
              <TravelRequestsManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/travel-tracking"
          element={
            isAdminAuthenticated() ? <TrackDelivery /> : <Navigate to="/" />
          }
        />

        {/* additional service management */}
        <Route
          path="/additional-services"
          element={
            isAdminAuthenticated() ? (
              <AdditionalServiceManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/additional-service-requests"
          element={
            isAdminAuthenticated() ? (
              <AdditionalServiceRequestManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/payments"
          element={isAdminAuthenticated() ? <Payments /> : <Navigate to="/" />}
        />


<Route
          path="/feedback"
          element={
            isAdminAuthenticated() ? (
              <FeedbackTablePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/complaint"
          element={
            isAdminAuthenticated() ? (
              <ComplaintsTablePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/updatefeedback/:id"
          element={
            isAdminAuthenticated() ? (
              <UpdateFeedbackPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/updatecomplaint/:id"
          element={
            isAdminAuthenticated() ? (
              <UpdateComplaintPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
