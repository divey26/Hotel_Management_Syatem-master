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
import { useReactToPrint } from "react-to-print";


const { Title } = Typography;
const { Content } = Layout;

const Summa = ({stockId}) => {
  const [qrValue, setQrValue] = useState("");
  const componentRef = React.useRef();

  
  useEffect(() => {
    // Update QR code value when stockId changes
    setQrValue(stockId);
  }, [stockId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Content style={{ padding: "24px" }}>
      <div style={{ textAlign: "center" }}>
        <QRCode value={qrValue} style={{ marginBottom: "20px" }} />
       <br/>
      
        <Button type="primary" onClick={handlePrint}>
        Print QR Code            
        </Button>
      </div>
      <div style={{ display: "none" }}>
        <div ref={componentRef} style={{ textAlign: "center" , marginTop:"250px"}}>
          <QRCode value={qrValue} />
        </div>
      </div>
    </Content>
   
   
  );
};


export default Summa;
