import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Template from "./Template";
import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import Booking from "./Booking/Bookings";
import FoodOrderingPage from "./Food-order/FoodOrderingPage";
import PaymentForm from "./Payment/PaymentForm";
import AdditionalService from "./AdditionalService/AdditionalService";
import Events from "./Events/Events";
import VehiclesPage from "./Travels/Travels";
import Orders from "./Food-order/Orders";
import EventBookings from "./Events/EventBookings";
import AdditionalServiceRequests from "./AdditionalService/AdditionalServiceRequests";
import TravelRequests from "./Travels/TravelRequests";
import Feedback from "./Customer_Affair_User/Customer_Affair";
import RaiseComplaintPage from "./Customer_Affair_User/Complaint/Complaint"
import FeedbackForm from "./Customer_Affair_User/Feedback/Feedback"

function App() {
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");

  const isAuthenticated = () => {
    return storedCustomerId && storedAuthToken;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Template children={<Landing />} />} />
        <Route path="/login" element={<Template children={<Login />} />} />
        <Route
          path="/register"
          element={<Template children={<Register />} />}
        />
        <Route
          path="/foods"
          element={<Template children={<FoodOrderingPage />} />}
        />
        <Route path="/events" element={<Template children={<Events />} />} />
        <Route
          path="/vehicles"
          element={<Template children={<VehiclesPage />} />}
        />
        <Route
          path="/additional-services"
          element={<Template children={<AdditionalService />} />}
        />
        {/* Protected routes */}
        <Route
          path="/bookings"
          element={
            isAuthenticated() ? (
              <Template children={<Booking />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payment"
          element={
            isAuthenticated() ? (
              <Template children={<PaymentForm />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated() ? (
              <Template children={<Orders />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/event-requests"
          element={
            isAuthenticated() ? (
              <Template children={<EventBookings />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/travel-requests"
          element={
            isAuthenticated() ? (
              <Template children={<TravelRequests />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/additional-service-requests"
          element={
            isAuthenticated() ? (
              <Template children={<AdditionalServiceRequests />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      
      <Route
          path="/feedback"
          element={
            isAuthenticated() ? (
              <Template children={<Feedback />} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      <Route
          path="/give-feedback"
          element={
            isAuthenticated() ? (
              <Template children={< FeedbackForm/>} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
       <Route
          path="/raise-complaint"
          element={
            isAuthenticated() ? (
              <Template children={< RaiseComplaintPage/>} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
