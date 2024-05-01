import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const EventForm = ({ form, onFinish }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations`
      );
      setLocations(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

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
            name="locations"
            label="Locations"
            rules={[{ required: true, message: "Please select location(s)!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select location(s)"
              style={{ width: "100%" }}
            >
              {locations.map((location) => (
                <Option key={location._id} value={location._id}>
                  {location.name}
                </Option>
              ))}
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

export default EventForm;
