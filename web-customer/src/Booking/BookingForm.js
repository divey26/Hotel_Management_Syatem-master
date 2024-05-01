import React from "react";
import { Form, Input, DatePicker, Button, Typography, InputNumber } from "antd";

const { Title } = Typography;

const BookingForm = ({ form, onFinish }) => {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateCheckInDate = (_, value) => {
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Check-in date cannot be in the past");
    }
    return Promise.resolve();
  };

  const validateCheckOutDate = (_, value) => {
    const checkInDate = form.getFieldValue("checkInDate");
    if (value && checkInDate && value.isBefore(checkInDate, "day")) {
      return Promise.reject("Check-out date must be after check-in date");
    }
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Check-out date cannot be in the past");
    }
    return Promise.resolve();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", marginTop: "50px" }}>
      <Title level={2}>Booking Form</Title>
      <Form
        form={form}
        name="bookingForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Check-in Date"
          name="checkInDate"
          rules={[
            { required: true, message: "Please input check in!" },
            { validator: validateCheckInDate },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Check-out Date"
          name="checkOutDate"
          dependencies={["checkInDate"]}
          rules={[
            { required: true, message: "Please input check out!" },
            { validator: validateCheckOutDate },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Number of Guests"
          name="numberOfGuests"
          rules={[{ required: true, message: "Please input no of guests!" }]}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item label="Special Requests" name="requests">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Book Now
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookingForm;
