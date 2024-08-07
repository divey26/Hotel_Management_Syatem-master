import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import {
  Form,
  Input,
  Typography,
  Button,
  Switch,
  InputNumber,
  Row,
  Col,
  Space,
  DatePicker,
  notification,
} from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

const AddCustomer = () => {
  const [form] = Form.useForm();
  const [size] = useState("large");
  const [customerCode, setCustomerCode] = useState("");

  useEffect(() => {
    // Generate the customer code when the component mounts
    generateCustomerCode();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const generateCustomerCode = () => {
    // Generate a 16-digit number
    const randomCode = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    );
    setCustomerCode(String(randomCode));
  };
  const handleAddCustomer = (values) => {
    console.log("Submitted values:", values);
    form.resetFields();
  };
  const handleGenerateCode = () => {
    // Generate a new customer code on button click
    generateCustomerCode();
    // Fill the customer code field with the new code
    form.setFieldsValue({ customerCode });
  };
  const boldLabelStyle = { fontWeight: "bold" };

  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  return (
    <Layout userType={loggedInUserType}>
      <Space
        style={{
          background: "#001529",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Space>
          <UserOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
          <Title
            level={2}
            style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
          >
            Customer
          </Title>
        </Space>
      </Space>
      <br />
      <br />
      <Form
        form={form}
        onFinish={handleAddCustomer}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 30 }}
        style={{
          border: "2px solid #001529",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Customer Code
                </Typography.Text>
              }
              name="customerCode"
            >
              <Input value={customerCode} readOnly />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item>
              <Button
                type="default"
                size="small"
                icon={<DoubleRightOutlined />}
                onClick={handleGenerateCode}
                style={{ marginLeft: "8px" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  First Name
                </Typography.Text>
              }
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Last Name
                </Typography.Text>
              }
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Phone Number
                </Typography.Text>
              }
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>Email</Typography.Text>
              }
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Address
                </Typography.Text>
              }
              name="address"
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Date of Birth
                </Typography.Text>
              }
              name="dob"
              rules={[
                {
                  required: true,
                  type: "date",
                  message: "Please select the date of birth",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();

                    if (selectedDate < currentDate) {
                      return Promise.resolve();
                    }

                    notification.error({
                      message: "Invalid Date",
                      description: "Please select a future date.",
                    });

                    return Promise.reject(
                      new Error("Please select a future date")
                    );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>City</Typography.Text>
              }
              name="city"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Postal Code
                </Typography.Text>
              }
              name="postalCode"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>
                  Credit Limit
                </Typography.Text>
              }
              name="creditLimit"
              rules={[{ type: "number", min: 0 }]}
            >
              <InputNumber min={1}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={
                <Typography.Text style={boldLabelStyle}>Active</Typography.Text>
              }
              name="active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col
            span={20}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Form.Item>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                size={size}
                htmlType="submit"
                style={{
                  marginRight: "-170px",
                }}
              >
                Add New Customer
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default AddCustomer;
