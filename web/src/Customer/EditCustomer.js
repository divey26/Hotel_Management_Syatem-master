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
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import moment from 'moment';
import { useParams } from "react-router-dom"; // Assuming you use react-router for routing
const { Title } = Typography;
const fetchCustomerData = async (customerId) => {
    // Replace this with your actual API call or data fetching logic
    // For demonstration purposes, returning a mock customer data
    const mockCustomerData = {
        customerCode: "CC001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
        //dob:"2004/02/14",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        creditLimit: 5000,
        // ... other customer data fields
      };
      
  
    return mockCustomerData;
  };
const EditCustomer = () => {
   // const location = useLocation();
  //const { customerDetails } = location.state || {};
  const [form] = Form.useForm();
  const [size] = useState("large");
  const [customerCode, setCustomerCode] = useState("");
  const { customerId } = useParams(); // Assuming you have a parameter named 'customerId' in your route

  useEffect(() => {
    // Fetch customer data based on the customer ID
      fetchCustomerData(customerId)
      .then((customerData) => {
        form.setFieldsValue(customerData);
        setCustomerCode(customerData.customerCode);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        // Handle error, e.g., redirect to an error page
      });
  }, [customerId, form]);

  const handleEditCustomer = (values) => {
    console.log("Updated values:", values);
    // Perform the API call or dispatch an action to update the customer data
    // After successful update, you might want to redirect the user to a different page
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
      {/* Header Section */}
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
            Edit Customer
          </Title>
        </Space>
      </Space>

      <br />
      <br />

      {/* Form Section */}
      <Form
        form={form}
        onFinish={handleEditCustomer}
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
    <DatePicker
      style={{ width: "100%" }}
      format="YYYY/MM/DD" // Set the desired date format
      onChange={(date, dateString) => {
        // Handle the formatted date as needed
        // dateString will contain the selected date in the specified format
      }}
    />
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
              <InputNumber />
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
                 Update Customer
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default EditCustomer;
