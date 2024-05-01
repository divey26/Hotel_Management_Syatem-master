import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const StockForm = ({ form, onFinish }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/departments`
      );
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  console.log(departments);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select department!" }]}
          >
            <Select placeholder="Select department">
              {departments.map((department) => (
                <Option value={department._id}>{department.name}</Option>
              ))}
            </Select>
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
          <Form.Item name="description" label="Description">
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
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input category!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="unit" label="Unit">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="quantity" label="Quantity">
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

export default StockForm;
