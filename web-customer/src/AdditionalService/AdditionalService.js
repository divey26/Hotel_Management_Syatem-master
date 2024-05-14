import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  message,
  Button,
  Typography,
  Modal,
  DatePicker,
  InputNumber,
  Form,
  Input,
  Divider,
} from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const AdditionalService = () => {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState({});
  const [data, setData] = useState([]);

  const fetchAdditionalServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-services`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching additional-services:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalServices();
  }, []);

  const handleBookEvent = (service) => {
    if (storedAuthToken && storedCustomerId) {
      setCurrentService(service);
      setIsModalVisible(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please login for request this service!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const handleOk = async (values) => {
    if (storedAuthToken && storedCustomerId) {
      const payload = {
        ...values,
        user: storedCustomerId,
        service: currentService._id,
      };
      try {
        let response = null;
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/`,
          payload,
          {
            headers: {
              Authorization: storedAuthToken,
            },
          }
        );

        if (response.data.success) {
          setIsModalVisible(false);
          message.success(
            `Your request for ${currentService.name} has been sent.`
          );
          setCurrentService(null);
          form.resetFields();
          navigate("/additional-service-requests");
        }
      } catch (error) {
        message.error(error.response.data.message);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const validateDate = (_, value) => {
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Booking date cannot be in the past");
    }
    return Promise.resolve();
  };

  return (
    <div style={{ margin: "20px" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          fontSize: "50px",
          fontWeight: "bold",
          fontFamily: "'Lucida Handwriting', cursive", // Example cursive font
          marginBottom: "40px",
        }}
      >
        Gym and Spa Services
      </Title>
      <Divider />
      <Row
        justify="center"
        gutter={[16, 16]}
        style={{
          marginBottom: "40px",
          alignItems: "center",
          background: "#f7f7f7",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Col span={12}>
          <img
            alt="Gym and Spa"
            src="https://www.thespaandgym.com/images/gallery2/Manchester%20Spa%201.jpg?text=Spa&space;entrance"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Col>
        <Col span={12}>
          <Paragraph
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "'Lucida Handwriting', cursive", // Example cursive font
            }}
          >
            Welcome to our premier Gym and Spa, where state-of-the-art fitness
            meets serene spa luxury. Our facilities are designed to offer a
            comprehensive wellness experience that caters to all aspects of
            health and relaxation. From our cutting-edge gym equipment and
            diverse fitness classes to our tranquil spa retreats offering
            massages, facials, and holistic treatments, we provide an
            environment perfectly suited for rejuvenating both body and mind.
            Explore the synergistic benefits of combining vigorous workouts with
            calming spa therapies. Our expert trainers and therapists work
            closely with you to create personalized regimens that align with
            your fitness goals and relaxation needs. Whether you’re looking to
            enhance physical strength, improve flexibility, or simply unwind in
            a soothing setting, our gym and spa is your ultimate sanctuary.
            Delight in our luxurious amenities, including heated pools, steam
            rooms, and private treatment rooms, each designed to offer utmost
            comfort and privacy.
          </Paragraph>
        </Col>
      </Row>

      <Divider />
      <Row gutter={[16, 16]}>
        {data.map((service) => (
          <Col key={service.id} span={8} style={{ display: "flex" }}>
            <Card
              hoverable
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Ensures the button aligns to the bottom
                height: "100%", // Ensures card takes full height
              }}
              cover={
                <img
                  alt={service.name}
                  src={service.imageUrls[0]}
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              }
            >
              <Card.Meta
                title={service.name}
                description={
                  <div style={{ overflow: "auto", marginBottom: "10px" }}>
                    {service.description}
                  </div>
                }
              />
              <Button
                type="primary"
                block
                onClick={() => handleBookEvent(service)}
              >
                Book Now
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={`Book ${currentService?.name}`}
        open={currentService && isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleOk}
          form={form}
        >
          <Form.Item
            label="Booking Date"
            name="bookingDate"
            rules={[
              { required: true, message: "Please input booking date !" },
              { validator: validateDate },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Number of Person"
            name="noOfPersons"
            rules={[
              { required: true, message: "Please input the number of persons!" },
               ({ getFieldValue }) => ({
                 validator(_, value) {
                   if (value && value > 5) {
                     return Promise.reject(new Error("Number of persons cannot exceed 5!"));
                  }
                   return Promise.resolve();
                 },
               }),
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Additional Requests" name="requests">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Book Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdditionalService;
