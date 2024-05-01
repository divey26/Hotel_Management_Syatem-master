import React from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";

const { Option } = Select;

const VehicleForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="make"
            label="Make"
            rules={[{ required: true, message: "Please input make!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Please input model!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please input year!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select type!" }]}
          >
            <Select>
              <Option value="Car">Car</Option>
              <Option value="Van">Van</Option>
              <Option value="Motorcycle">Motorcycle</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please input capacity!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="registrationNumber"
            label="Registration Number"
            rules={[
              { required: true, message: "Please input registration number!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VehicleForm;
