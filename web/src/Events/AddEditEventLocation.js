import React from "react";
import { Form, Row, Col, Input, Select } from "antd";

const EventLocationForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name!" }]}
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
          <Form.Item name="amenities" label="Amenities">
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="noOfSeats"
            label="No Of Seats"
            rules={[{ required: true, message: "Please input no of seats!" }]}
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

export default EventLocationForm;
