import { CarOutlined } from '@ant-design/icons';
import { Col, Card, Tag, Progress, Button, Modal, Input } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Space,Typography } from 'antd/lib';
import React, { useEffect, useState } from "react";
import LayoutNew from "../Layout";
import { Row } from 'antd';
const { Title } = Typography;
const TrackingDeliveryPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const sampleDeliveryData = [
    {
      trackingNumber: 'ABC123',
      status: 'In Transit',
      location: 'New York',
      estimatedDeliveryDate: '2024-03-20',
      recipientName: 'John Doe',
      recipientAddress: '123 Main St, New York',
      progress: 90,
    },
    {
      trackingNumber: 'DEF456',
      status: 'Delivered',
      location: 'Los Angeles',
      estimatedDeliveryDate: '2024-03-15',
      recipientName: 'Jane Smith',
      recipientAddress: '456 Elm St, Los Angeles',
      progress: 70,
    },
    // Add more delivery data as needed
  ];
  const handleCardClick = (order) => {
    setDeliveryInfo(order);
  };
  const handleSearch = () => {
    // Make an AJAX request to fetch delivery information based on the tracking number
    // Update the state with the received delivery information
    // Example:
    // fetch(`your-backend-url/${trackingNumber}`)
    //   .then(response => response.json())
    //   .then(data => setDeliveryInfo(data))
    //   .catch(error => console.error('Error fetching delivery information:', error));
  };
  const renderOrders = () => {
    return filteredData.map((order) => (
      <Col key={order.trackingNumber} xs={24} sm={12} md={8} lg={9}>
        <Card
          title={`Tracking Number: ${order.trackingNumber}`}
          extra={<Tag color={order.status === "Processing" ? "processing" : order.status === "Shipped" ? "success" : "default"}>{order.status}</Tag>}
          style={{ marginLeft: "10px", height: "300px", width: "350px" }}
          onClick={() => handleCardClick(order)}
        >
          <p>Customer Name: {order.recipientName}</p>
          <p>Customer Address: {order.recipientAddress}</p>
          <Progress percent={order.progress} size="large" style={{ marginBottom: "10px" }} />
          <Space>
            <Button type="primary" icon={<SearchOutlined />} size="large">
              Track
            </Button>
            {order.status === "Processing" && (
              <Button type="success" icon={<CheckCircleOutlined />} size="large">
                Mark as Shipped
              </Button>
            )}
            {order.status === "Processing" && (
              <Button type="danger" icon={<CloseCircleOutlined />} size="large">
                Cancel Order
              </Button>
            )}
          </Space>
        </Card>
      </Col>
    ));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = sampleDeliveryData.filter((order) =>
  order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
);

const [loggedInUserType, setLoggedInUserType] = useState('');

useEffect(() => {
  const userType = localStorage.getItem("loggedInUserType");
  if (userType) {
    setLoggedInUserType(userType);
  }
}, []);

  return (
    <LayoutNew userType={loggedInUserType}>
         <div>
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
            <CarOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
            <Title
              level={2}
              style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
            >
              Tracking Delivery Page
            </Title>
          </Space>
          
        </Space>
      <br/><br/>
      <div style={{ marginBottom: "20px" }}>
      <Input.Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Tracking Number"
            style={{ width: "80%" }}
            size="large"
          />
        </div>
        <Row gutter={16}>{renderOrders()}</Row>
        {/* Display delivery information here */}
        <Modal
          title="Delivery Information"
          visible={!!deliveryInfo}
          onCancel={() => setDeliveryInfo(null)}
          footer={null}
        >
          {deliveryInfo && (
            <div>
              <p>Tracking Number: {deliveryInfo.trackingNumber}</p>
              <p>Status: {deliveryInfo.status}</p>
              <p>Location: {deliveryInfo.location}</p>
              <p>Estimated Delivery Date: {deliveryInfo.estimatedDeliveryDate}</p>
              <p>Recipient Name: {deliveryInfo.recipientName}</p>
              <p>Recipient Address: {deliveryInfo.recipientAddress}</p>
            </div>
          )}
        </Modal>
      </div>
    </LayoutNew>
   
  );
};

export default TrackingDeliveryPage;
