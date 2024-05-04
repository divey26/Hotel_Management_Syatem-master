import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const AssignDriverVehicleForm = ({ form, onFinish }) => {
  const [driverData, setDriverData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/drivers`
      );
      setDriverData(response.data.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles`
      );
      setVehicleData(response.data.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="driver"
            label="Drivers"
            rules={[{ required: true, message: "Please select a driver!" }]}
          >
            <Select placeholder="Select a driver">
              {driverData.map((driver) => (
                <Option key={driver._id} value={driver._id}>
                  {driver.driverId} {driver.firstName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="vehicle"
            label="Vehicles"
            rules={[{ required: true, message: "Please select a vehicle!" }]}
          >
            <Select placeholder="Select a vehicle">
              {vehicleData.map((vehicle) => (
                <Option key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleId} {vehicle?.registrationNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AssignDriverVehicleForm;
