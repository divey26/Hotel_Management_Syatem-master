import React, { useState } from "react";
import { Layout, Typography, Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const RaiseComplaintPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    details: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Your name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errors.name = "Please enter a valid name (only letters and spaces)";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Your email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Your phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number (10 digits)";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/complaints", formData);
      if (response.status === 201) {
        message.success("Complaint submitted successfully");
        navigate("/viewcomplaint");
      }
    } catch (error) {
      message.error("Failed to submit complaint. Please try again later.");
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Title level={2} style={{ marginBottom: "20px", textAlign: "center", color: "#1890ff" }}>
          Raise a Complaint
        </Title>
        <Text style={{ marginBottom: "20px", display: "block", textAlign: "center", fontSize: "16px" }}>
          We're here to help. Please fill out the form below to submit your complaint.
        </Text>
        <Form
          name="complaintForm"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={formData}
        >
          <Form.Item
            label="Your Name"
            name="name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name}
            rules={[
              { required: true, message: "Please input your name!" },
              { pattern: /^[a-zA-Z\s]+$/, message: "Name should contain only letters and spaces" },
            ]}
          >
            <Input placeholder="Enter Your Name" onChange={(e) => handleInputChange("name", e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Your Email"
            name="email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter Your Email" onChange={(e) => handleInputChange("email", e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Your Phone Number"
            name="phone"
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone}
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\d{10}$/, message: "Phone number should contain only 10 digits" },
            ]}
          >
            <Input placeholder="Enter Your Phone Number" onChange={(e) => handleInputChange("phone", e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Complaint Category"
            name="category"
            validateStatus={errors.category ? "error" : ""}
            help={errors.category}
          >
            <Select placeholder="Select Complaint Category" onChange={(value) => handleInputChange("category", value)}>
              <Option value="product">Product Issue</Option>
              <Option value="service">Service Issue</Option>
              <Option value="billing">Billing Issue</Option>
              <Option value="general">General Inquiry</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Complaint Details"
            name="details"
            validateStatus={errors.details ? "error" : ""}
            help={errors.details}
          >
            <Input.TextArea placeholder="Enter Complaint Details" onChange={(e) => handleInputChange("details", e.target.value)} />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}>Submit</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default RaiseComplaintPage;
