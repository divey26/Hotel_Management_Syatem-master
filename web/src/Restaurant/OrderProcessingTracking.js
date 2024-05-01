import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Input,
  message,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;

const OrderProcessingPage = () => {
  const token = localStorage.getItem("authToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [loggedInUserType, setLoggedInUserType] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders`
      );
      setFilteredOrders(
        response.data.data.filter((order) =>
          [
            "Confirmed",
            "Processing",
            "Ready-to-deliver",
            "Waiting-for-pickup",
            "Picked-up",
            "Delivered",
          ].includes(order.status)
        )
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filteredData = filteredOrders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filteredData);
    } else {
      fetchOrders();
    }
  }, [searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const processOrder = async (orderId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/${orderId}`,
        {
          status: "Processing",
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const readyToDeliver = async (order) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/${order._id}`,
        {
          status: "Ready-to-deliver",
        }
      );
      addTravelRequestForDelivery(order);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const addTravelRequestForDelivery = async (order) => {
    try {
      const payload = {
        travelType: "food-delivery",
        startupLocation: "148/10, Station Road, Jaffna",
        endupLocation: order.deliveryAddress,
        order: order._id,
        travelStartDateTime: new Date(),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        message.success(`Requested for delivery!`);
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <Layout userType={loggedInUserType}>
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
            <SolutionOutlined
              style={{ fontSize: "24px", marginRight: "8px" }}
            />
            <Title
              level={2}
              style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
            >
              Order Processing & Tracking
            </Title>
          </Space>
        </Space>
        <br />
        <br />

        {/* Search Bar */}
        <Search
          placeholder="Search by Order ID or Customer Name"
          allowClear
          onSearch={handleSearch}
          style={{ marginBottom: "16px" }}
          size="large"
        />

        {/* Display Confirmed Orders */}
        <Row gutter={[16, 16]}>
          {filteredOrders.map((order) => (
            <Col key={order._id} xs={24} sm={12} md={8} lg={6}>
              <Card title={`Order ID: ${order._id}`} size="small">
                <p>
                  <strong>Items:</strong>
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Delivery Address:</strong> {order.deliveryAddress}
                </p>
                <p>
                  <strong>Total Price:</strong> {order.totalPrice.toFixed(2)}{" "}
                  LKR
                </p>
                <Tag color="blue">{order.status}</Tag>
                {order.status === "Confirmed" && (
                  <Button
                    type="primary"
                    block
                    style={{ margin: "8px 0" }}
                    onClick={() => processOrder(order._id)}
                  >
                    Process Order
                  </Button>
                )}
                {order.status === "Processing" && (
                  <Button
                    type="primary"
                    block
                    style={{ margin: "8px 0" }}
                    onClick={() => readyToDeliver(order)}
                  >
                    Ready to deliver
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <br />
        <br />
      </div>
    </Layout>
  );
};

export default OrderProcessingPage;
