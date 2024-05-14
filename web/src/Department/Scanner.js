//Scanner.js

import React, { useRef,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

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

const Scanner = () => {
    const webcamRef = useRef(null);
    const [scanned, setScanned] = useState(null);
    const navigate = useNavigate();
 

  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  const handleScan = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
  
    if (code) {
      setScanned(code.data);
      navigate(`/details/${code.data}`);

    } else {
      alert('No QR code found');
    }
  };

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Webcam
           audio={false}
           height={320}
           ref={webcamRef}
           screenshotFormat="image/jpeg"
           width={500}
           videoConstraints={{
                facingMode: 'environment',
           }}
       />

<div style={{ marginLeft: "540px", marginRight: "auto", marginTop:"20px" }}>
              <Button
                type="primary"
                onClick={handleScan}
              >
                Scan
              </Button>
            </div>
            <br></br>
  {scanned && <p>Scanned: {scanned}</p>}
</div>







        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default Scanner;
