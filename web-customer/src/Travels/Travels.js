import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Card, Drawer, Button, Input, Form, message, Carousel } from "antd";
import moment from "moment";

function VehiclesPage() {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const carouselRef = React.useRef();
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
          vehicle: selectedVehicle._id,
        });
        console.log(response);
        message.success("Your request sent successful!");
        form.resetFields();
        navigate("/travel-requests");
        closeDrawer();
      } catch (error) {
        console.error("Error submitting request", error);
        message.error("Failed to submit request.");
      }
    }
  };

  const validateBookingDate = (_, value) => {
    if (value && moment(value).isBefore(moment(), "day")) {
      return Promise.reject("Booking date time cannot be in the past");
    }
    return Promise.resolve();
  };

  const validateNoOfPersons = (_, value) => {
    if (value > selectedVehicle.capacity) {
      return Promise.reject(
        `No of persons cannot be exceeded than ${selectedVehicle.capacity}`
      );
    }
    return Promise.resolve();
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
          {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
            <Carousel autoplay style={{ maxWidth: "auto", margin: "auto" }}>
              {vehicle.imageUrls.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`${vehicle.make} Image ${index + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "auto",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <p>No images available</p>
          )}
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
          <Form layout="vertical" from={form} onFinish={handleSubmit}>
            <Form.Item
              label="Passengers"
              name="passengers"
              rules={[
                {
                  required: true,
                  message: "Please input the number of passengers!",
                },
                { validator: validateNoOfPersons },
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
                { validator: validateBookingDate },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="requests" label="Additional Requests">
              <Input.TextArea />
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
