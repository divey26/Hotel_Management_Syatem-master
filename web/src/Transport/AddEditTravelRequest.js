import React from "react";
import { Form, Row, Col, Input, Button, DatePicker, Select } from "antd";

const { Option } = Select;

const TravelRequestForm = ({ form, onFinish }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="passengers"
            label="Passengers"
            rules={[
              { required: true, message: "Please input number of passengers!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="travelType"
            label="Travel Type"
            rules={[
              { required: true, message: "Please select a travel type!" },
            ]}
          >
            <Select placeholder="Select a travel type">
              <Option value="food-delivery">Food Delivery</Option>
              <Option value="customer-travel">Customer Travel</Option>
              <Option value="import-export">Import Export</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="startupLocation"
            label="Startup Location"
            rules={[
              { required: true, message: "Please input startup location!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="endupLocation"
            label="Endup Location"
            rules={[
              { required: true, message: "Please input endup location!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="travelStartDateTime"
            label="Travel Start Date Time"
            rules={[
              {
                required: true,
                message: "Please select travel start date and time!",
              },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="travelEndDateTime" label="Travel End Date Time">
            <DatePicker showTime />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select a status">
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
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

export default TravelRequestForm;
