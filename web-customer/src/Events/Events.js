import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Carousel,
  Button,
  Drawer,
  Form,
  DatePicker,
  InputNumber,
  Input,
  message,
} from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "react-medium-image-zoom/dist/styles.css";

function EventLocations({ locations }) {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const [visible, setVisible] = useState(false);
  const [selectedEventLocation, setSelectedEventLocation] = useState(null);
  const carouselRef = React.useRef();
  const [form] = Form.useForm();

  const goTo = (dir) => {
    if (dir === "prev") {
      carouselRef.current.prev();
    } else {
      carouselRef.current.next();
    }
  };

  const showDrawer = (event) => {
    if (storedCustomerId && storedAuthToken) {
      setSelectedEventLocation(event);
      setVisible(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please login for book an event!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const closeDrawer = () => {
    setVisible(false);
    setSelectedEventLocation(null);
  };

  const handleBookEvent = async (values) => {
    if (storedCustomerId && storedAuthToken) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/event-requests/`,
          {
            ...values,
            location: selectedEventLocation._id,
            user: storedCustomerId,
          }
        );
        message.success("Event requested successfully!");
        form.resetFields();
        navigate("/event-requests");
        closeDrawer();
      } catch (error) {
        message.error("Failed to submit event request.");
      }
    }
  };

  const validateBookingDate = (_, value) => {
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Booking date cannot be in the past");
    }
    return Promise.resolve();
  };

  const validateNoOfGuests = (_, value) => {
    if (value > selectedEventLocation.noOfSeats) {
      return Promise.reject(
        `No of guests cannot be exceeded than ${selectedEventLocation.noOfSeats}`
      );
    }
    return Promise.resolve();
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {locations.length > 1 && (
        <>
          <Button
            onClick={() => goTo("prev")}
            style={{ position: "absolute", left: 0, zIndex: 1 }}
            icon={<LeftOutlined />}
          />
          <Button
            onClick={() => goTo("next")}
            style={{ position: "absolute", right: 0, zIndex: 1 }}
            icon={<RightOutlined />}
          />
        </>
      )}
      <br />
      <Carousel ref={carouselRef} dots={false}>
        {locations.map((location, idx) => (
          <div key={idx} style={{ textAlign: "center", padding: "20px" }}>
            <h3>{location.name}</h3>
            <p>Seats available: {location.noOfSeats}</p>
            {location.imageUrls && location.imageUrls.length > 0 ? (
              <Carousel autoplay style={{ maxWidth: "500px", margin: "auto" }}>
                {location.imageUrls.map((imageUrl, index) => (
                  <div key={index}>
                    <img
                      src={imageUrl}
                      alt={`${location.name} Image ${index + 1}`}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
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
            <Button
              type="primary"
              onClick={() => showDrawer(location)}
              style={{ marginTop: 10 }}
            >
              Book Now
            </Button>
          </div>
        ))}
      </Carousel>
      <Drawer
        title={`Book ${selectedEventLocation?.name}`}
        placement="right"
        onClose={closeDrawer}
        open={visible}
        width={350}
      >
        <Form layout="vertical" form={form} onFinish={handleBookEvent}>
          <Form.Item
            label="Event Booking Date"
            name="bookingDate"
            rules={[
              { required: true, message: "Please input event booking date!" },
              { validator: validateBookingDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Number of Guests"
            name="noOfGuests"
            rules={[
              { required: true, message: "Please input no of guests!" },
              { validator: validateNoOfGuests },
            ]}
          >
            <Input type = "number" min={1} />
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
      </Drawer>
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/events`
        );
        console.log(response.data);
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        margin: "20px",
      }}
    >
      {events.map((event, index) => (
        <Card
          key={index}
          title={event.name}
          cover={
            <img
              alt={event.name}
              src={event.imageUrls}
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
          style={{ width: 300, margin: "10px" }}
        >
          <p>{event.description}</p>
          <EventLocations locations={event.locations} />
        </Card>
      ))}
    </div>
  );
}

export default Events;
