import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Card, Drawer, Button, Input, Form, message } from "antd";

function VehiclesPage() {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles`
        );
        setVehicles(response.data.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
    fetchVehicles();
  }, []);

  const handleBook = (vehicle) => {
    if (storedCustomerId && storedAuthToken) {
      setSelectedVehicle(vehicle);
      setIsDrawerOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please login for booking travels!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVehicle(null);
  };

  const handleSubmit = async (values) => {
    if (storedCustomerId && storedAuthToken) {
      try {
        const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/`;
        const response = await axios.post(apiUrl, {
          ...values,
          travelType: "customer-travel",
          user: storedCustomerId,
          vehicleId: selectedVehicle._id,
        });
        console.log(response);
        message.success("Your request sent successful!");
        closeDrawer();
      } catch (error) {
        console.error("Error submitting request", error);
        message.error("Failed to submit request.");
      }
    }
  };

  return (
    <div>
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.registrationNumber}
          title={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
          bordered={true}
          style={{ width: 300, margin: "16px", float: "left" }}
          actions={[
            <Button type="primary" onClick={() => handleBook(vehicle)}>
              Book
            </Button>,
          ]}
        >
          <p>Type: {vehicle.type}</p>
          <p>Capacity: {vehicle.capacity}</p>
          <p>Registration Number: {vehicle.registrationNumber}</p>
        </Card>
      ))}

      <Drawer
        title="Book Vehicle"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={360}
      >
        {selectedVehicle && (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Passengers"
              name="passengers"
              rules={[
                {
                  required: true,
                  message: "Please input the number of passengers!",
                },
              ]}
            >
              <Input placeholder="Number of Passengers" />
            </Form.Item>
            <Form.Item
              label="Start Location"
              name="startupLocation"
              rules={[
                { required: true, message: "Please input the start location!" },
              ]}
            >
              <Input placeholder="Start Location" />
            </Form.Item>
            <Form.Item
              label="End Location"
              name="endupLocation"
              rules={[
                { required: true, message: "Please input the end location!" },
              ]}
            >
              <Input placeholder="End Location" />
            </Form.Item>
            <Form.Item
              label="Start Date and Time"
              name="travelStartDateTime"
              rules={[
                {
                  required: true,
                  message: "Please select the start date and time!",
                },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item
              label="End Date and Time"
              name="travelEndDateTime"
              rules={[
                {
                  required: true,
                  message: "Please select the end date and time!",
                },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Booking
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
}

export default VehiclesPage;
