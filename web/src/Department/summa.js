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

const Summa = ({stockId}) => {
  const [qrValue, setQrValue] = useState("");
 



  useEffect(() => {
    // Update QR code value when stockId changes
    setQrValue(stockId);
  }, [stockId]);
  


  return (
    <Content style={{ padding: "24px" }}>
    <div style={{ textAlign: "center" }}>
      <QRCode value={qrValue} style={{ marginBottom: "20px" }} />
    </div>
  </Content>
   
  );
};


export default Summa;
