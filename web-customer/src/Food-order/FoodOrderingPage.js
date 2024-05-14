import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  InputNumber,
  Space,
  Form,
  message,
  Carousel,
  Typography,
  Badge,
  Modal,
  Input,
} from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Item } = List;

const FoodOrderingPage = () => {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const [menuItems, setMenuItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/menus`
        );
        setMenuItems(response.data.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    }

    fetchMenuItems();
  }, []);

  const handleBuy = (menuItem) => {
    const values = form.getFieldsValue();
    const quantity = values[menuItem._id];

    // Update cart items
    setCartItems({
      ...cartItems,
      [menuItem._id]: (cartItems[menuItem._id] || 0) + quantity,
    });

    message.success(`Added ${quantity} ${menuItem.name}(s) to cart`);
  };

  const handleOpenCart = () => {
    setVisible(true);
  };

  const handleOrder = () => {
    if (storedAuthToken && storedCustomerId) {
      if (deliveryAddress &&  customerPhone) {
        createNewOrder();
      } else {
        message.error("Please enter delivery address and phone number to order");      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Please login for make orders!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const createNewOrder = async () => {
    if (storedCustomerId && storedAuthToken) {
      try {
        const orderItems = Object.keys(cartItems).map((key) => ({
          name: menuItems.find((item) => item._id === key).name,
          quantity: cartItems[key],
          price: menuItems.find((item) => item._id === key).price,
        }));

        const totalPrice = orderItems.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/orders`, {
          user: storedCustomerId,
          items: orderItems,
          totalPrice: totalPrice,
          deliveryAddress,
          phoneNumber: customerPhone,
        });

        message.success("Order placed successfully!");
        setVisible(false);
        navigate("/orders");
      } catch (error) {
        console.error("Error creating order:", error);
        message.error("Failed to place order. Please try again later.");
      }
    }
  };

  return (
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
          <UnorderedListOutlined
            style={{ fontSize: "24px", marginRight: "8px" }}
          />
          <Title
            level={2}
            style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
          >
            Menu
          </Title>
        </Space>
        <div style={{ textAlign: "right" }}>
          <Button type="default" onClick={handleOpenCart}>
            <Badge
              count={Object.values(cartItems).reduce(
                (acc, curr) => acc + curr,
                0
              )}
            >
              <ShoppingCartOutlined style={{ fontSize: "20px" }} />
            </Badge>
          </Button>
        </div>
      </Space>
      <br />
      <br />
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={menuItems}
        renderItem={(menuItem) => (
          <Item>
            <Card
              title={menuItem.name}
              extra={
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleBuy(menuItem)}
                >
                  Add to cart
                </Button>
              }
              style={{ height: "100%" }}
            >
              <Carousel autoplay className="room-slider">
                {menuItem.imageUrls.map((imageUrl, imageIndex) => (
                  <div key={imageIndex}>
                    <img
                      className="room-image"
                      alt={`${menuItem.description} - Image ${imageIndex + 1}`}
                      src={imageUrl}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
              <p>{menuItem.description}</p>
              <p>
                <strong>{menuItem.price} LKR</strong>
              </p>
              <Space>
                <Form form={form} name="quantity_form">
                  <Form.Item name={menuItem._id} initialValue={1}>
                    <InputNumber min={1} />
                  </Form.Item>
                </Form>
              </Space>
            </Card>
          </Item>
        )}
      />
      <Modal
        title="Items Added to Cart"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          dataSource={Object.keys(cartItems)}
          renderItem={(key) => (
            <List.Item>
              {menuItems.find((item) => item._id === key).name}:{" "}
              {cartItems[key]}
            </List.Item>
          )}
        />


<Form
          form={form}
          onFinish={handleOrder} // Added onFinish for form submission
        >
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {  },
              {
                pattern: /^[0-9]*$/,
                message: "Please enter only numbers.",
              },
              {
                len: 10,
                message: "Phone number should be 10 digits long.",
              },
            ]}
          >
            <Input
              value={customerPhone}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                setCustomerPhone(inputValue);
              }}
              maxLength={10} // Limit input to 10 characters
            />
          </Form.Item>

          <Form.Item
            label="Delivery Address"
            name="deliveryAddress"
            rules={[
              {
                required: true,
                message: "Please enter your delivery address!",
              },
            ]}
          >
            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Order Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodOrderingPage;
