import React, { useEffect, useState } from "react";

import QRCode from "react-qr-code";
import {
  Layout,
  Typography,
  Form,
  Input,
  Space,
  Button,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";


const { Title } = Typography;
const { Content } = Layout;

const Summa = () => {
  const [text, setText] = useState("");

 

  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  
  function handleChange(e) {
    setText(e.target.value)
  }

  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <Content style={{ padding: "24px" }}>

          {/* Style for page header */}
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
            {/*page header start */}
            <Space>
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
              >
                QR code generator
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={''}
              >
                Add New Supplier
              </Button>
            </div>
          </Space>
          {/* end*/}
          
          <br />
          <br />
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Search input */}
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={''}
              style={{ marginRight: "8px" }}
            />
          </div>
       
   <div style={{ textAlign: 'center' }}>
     <QRCode value={text} style={{marginBottom: '20px'}} />
  <h3>Enter your text here</h3>
  <input 
    type="text" 
    value={text} 
    onChange={(e) => { handleChange(e) }} 
    style={{ marginTop: '20px' }} // Optional: Adds some space between input and QR code
   />
    </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default Summa;
