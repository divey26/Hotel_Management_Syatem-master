import React, { useState } from "react";
import { Layout, Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom"; 
import LayoutNew from "../Layout";
import Table from "./Table";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Title } = Typography;

const Customer = () => {
  const navigate = useNavigate();
  const [size] = useState("large");
  const handleCreateNewCustomer = () => {
    // Navigate to the AddCustomer page
    navigate("/addcustomer");
  };
  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);
  return (
    <LayoutNew userType={loggedInUserType}>
      <Content style={{ padding: "24px" }}>
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
          <div style={{ marginLeft: "auto", marginRight: "20px" }}>
            {/* Adjust the marginRight value to create the desired gap */}
            <Button type="primary" icon={<UserAddOutlined />} size={size} onClick={handleCreateNewCustomer} >
              Create New Customer
            </Button>
          </div>
        </Space>
        <br /><br />
        <Table />
      </Content>
    </LayoutNew>
  );
};

export default Customer;
