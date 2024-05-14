import React from "react";
import { Form, Row, Col, Input, Select, Button } from "antd";

const { Option } = Select;

const EmployeeForm = ({ form, onFinish }) => {
  const validatePhoneNumber = (rule, value, callback) => {
    if (value && !/^[0-9]{10}$/.test(value)) {
      callback("Please input a valid 10-digit phone number!");
    } else {
      callback();
    }
  };

  const validateEmail = (rule, value, callback) => {
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      callback("Please input a valid email address!");
    } else {
      callback();
    }
  };

  const validateFirstName = (rule, value, callback) => {
    if (value && !/^[a-zA-Z]+$/.test(value)) {
      callback("Please input letters only for the first name!");
    } else {
      callback();
    }
  };

  const validateLastName = (rule, value, callback) => {
    if (value && !/^[a-zA-Z]+$/.test(value)) {
      callback("Please input letters only for the last name!");
    } else {
      callback();
    }
  };

  const validateLettersOnly = (rule, value, callback) => {
    if (value && !/^[a-zA-Z]+$/.test(value)) {
      callback("Please input letters only!");
    } else {
      callback();
    }
  };

  const validateZipCode = (rule, value, callback) => {
    if (value && !/^[0-9]+$/.test(value)) {
      callback("Please input numbers only for the zip code!");
    } else {
      callback();
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input first name!" },
              { validator: validateFirstName },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Please input last name!" },
              { validator: validateLastName },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { validator: validateEmail },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input phone!" },
              { validator: validatePhoneNumber },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="city"
            label="City"
            rules={[
              { required: true, message: "Please input city!" },
              { validator: validateLettersOnly },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="state"
            label="State"
            rules={[
              { required: true, message: "Please input state!" },
              { validator: validateLettersOnly },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="country"
            label="Country"
            rules={[
              { required: true, message: "Please input country!" },
              { validator: validateLettersOnly },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[
              { required: true, message: "Please input zip code!" },
              { validator: validateZipCode },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select placeholder="Select role">
              <Option value="manager">Manager</Option>
              <Option value="receptionist">Receptionist</Option>
              <Option value="cleaning_staff">Cleaning Staff</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EmployeeForm;