import React from "react";
import { Layout, Typography, Button, Divider, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { SmileOutlined, CommentOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const CustomerAffairsPage = () => {
  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#1890ff" }}>
            Welcome to Valampuri Hotel
          </Title>
          <Paragraph style={{ fontSize: "18px", marginBottom: "16px" }}>
            Your Experience Matters to Us
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Our Commitment to You</Title>
          <Paragraph style={{ fontSize: "16px" }}>
            At Valampuri Hotel, we are dedicated to providing exceptional
            service and ensuring your satisfaction. Your feedback and concerns
            play a vital role in our continuous improvement process.
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Why Your Feedback Matters</Title>
          <Paragraph style={{ fontSize: "16px" }}>
            <ul>
              <li>Enhancing your experience</li>
              <li>Creating memorable moments</li>
              <li>Building lasting relationships</li>
            </ul>
            Your input helps us tailor our services to meet your needs and
            exceed your expectations.
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            style={{ marginRight: "12px", backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            <Link to="/feedback" style={{ color: "#fff" }}>
              <CommentOutlined style={{ marginRight: "8px" }} />
              Share Your Experience
            </Link>
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          >
            <Link to="/complaint" style={{ color: "#fff" }}>
              <SmileOutlined style={{ marginRight: "8px" }} />
              Let Us Help You
            </Link>
          </Button>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Contact Us</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Paragraph style={{ fontSize: "16px" }}>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@valampurihotel.com">info@valampurihotel.com</a>
              </Paragraph>
            </Col>
            <Col xs={24} sm={12}>
              <Paragraph style={{ fontSize: "16px" }}>
                <strong>Phone:</strong>{" "}
                <a href="tel:+94756116081">+94 (75) 611-6081</a>
              </Paragraph>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CustomerAffairsPage;
