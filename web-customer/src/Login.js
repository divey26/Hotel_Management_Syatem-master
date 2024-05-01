import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    if (!values.email || !values.password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/customers/login`,
        values
      );
      if (response.data.success) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          const authToken = response.data.token;
          localStorage.setItem("customerId", response.data.data._id);
          localStorage.setItem("customerAuthToken", authToken);
          navigate("/");
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response.data.message,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          Login
        </Title>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          Don't you have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
