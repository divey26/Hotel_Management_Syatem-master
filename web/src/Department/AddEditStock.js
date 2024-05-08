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

  const handlePriceChange = (value) => {
    const quantityFieldValue = form.getFieldValue("quantity");
    const totalPrice = parseFloat(value) * parseFloat(quantityFieldValue);
    form.setFieldsValue({ category: totalPrice.toFixed(2) });
  };

  const handleQuantityChange = (value) => {
    const priceFieldValue = form.getFieldValue("price");
    const totalPrice = priceFieldValue * value;
    form.setFieldsValue({ category: totalPrice });
  };
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
            rules={[
              { required: true, message: "Please input price!" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "cents must be included",
              },
            ]}
          >
            <Input onChange={(e) => handlePriceChange(e.target.value)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input quantity!" }]}
          >
            <Input onChange={(e) => handleQuantityChange(e.target.value)} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="unit" label="Unit">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="category"
            label="Total"
            rules={[{ required: true, message: "Please input total!" }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        
      </Row>
    </Form>
  );
};

export default StockForm;
