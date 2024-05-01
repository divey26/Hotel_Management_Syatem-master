import React from "react";
import { Form, Row, Col, Input, Select } from "antd";

const RoomForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="number"
            label="Number"
            rules={[{ required: true, message: "Please input room number!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input location!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="amenities" label="Amenities">
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please input capacity!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="availability"
            label="Availability"
            rules={[{ required: true, message: "Please input availability!" }]}
          >
            <Select placeholder="Select availability">
              <Select.Option value={true}>Available</Select.Option>
              <Select.Option value={false}>Not Available</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RoomForm;
