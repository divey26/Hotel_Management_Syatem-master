import React from "react";
import { Form, Row, Col, Input, Select, Button } from "antd";

const { Option } = Select;

const MenuForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select type!" }]}
          >
            <Select placeholder="Select type">
              <Option value="food">Food</Option>
              <Option value="beverage">Beverage</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input category!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
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
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
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
            name="availability"
            label="Availability"
            rules={[{ required: true, message: "Please select availability!" }]}
          >
            <Select placeholder="Select availability" mode="multiple">
              <Option value="Monday">Monday</Option>
              <Option value="Tuesday">Tuesday</Option>
              <Option value="Wednesday">Wednesday</Option>
              <Option value="Thursday">Thursday</Option>
              <Option value="Friday">Friday</Option>
              <Option value="Saturday">Saturday</Option>
              <Option value="Sunday">Sunday</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="meal"
            label="Meal"
            rules={[{ required: true, message: "Please select meal!" }]}
          >
            <Select placeholder="Select meal" mode="multiple">
              <Option value="breakfast">Breakfast</Option>
              <Option value="lunch">Lunch</Option>
              <Option value="dinner">Dinner</Option>
            </Select>
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

export default MenuForm;
