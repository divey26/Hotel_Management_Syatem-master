import React from "react";
import { Form, Row, Col, Input, Select, Button } from "antd";

const { Option } = Select;

const EmployeeForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input phone!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please input city!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please input state!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please input country!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[{ required: true, message: "Please input zip code!" }]}
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

export default EmployeeForm;
