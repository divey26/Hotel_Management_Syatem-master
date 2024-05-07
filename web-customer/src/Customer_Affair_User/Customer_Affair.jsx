import React from "react";
import { Layout, Typography, Button, Divider, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { SmileOutlined, CommentOutlined } from "@ant-design/icons"; // Import additional icons

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const CustomerAffairsPage = () => {
  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#1890ff" }}>
            Customer Affairs
          </Title>
          <Paragraph style={{ fontSize: "18px", marginBottom: "16px" }}>
            Your Satisfaction is Our Top Priority
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Introduction</Title>
          <Paragraph style={{ fontSize: "16px" }}>
            At our organization, we highly value your feedback and concerns as
            they help us improve our products and services. This page is
            dedicated to providing you with the means to share your experiences,
            concerns, and feedback.
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Importance of Customer Affairs</Title>
          <Paragraph style={{ fontSize: "16px" }}>
            <ul>
              <li>Improving products/services</li>
              <li>Building trust and loyalty</li>
              <li>Ensuring customer retention</li>
            </ul>
            We are committed to addressing your concerns promptly and
            transparently.
          </Paragraph>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            style={{ marginRight: "12px", backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            <Link to="/give-feedback" style={{ color: "#fff" }}>
              <CommentOutlined style={{ marginRight: "8px" }} />
              Give Feedback
            </Link>
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          >
            <Link to="/raise-complaint" style={{ color: "#fff" }}>
              <SmileOutlined style={{ marginRight: "8px" }} />
              Raise a Complaint
            </Link>
          </Button>
        </div>
        <Divider />
        <div style={{ marginBottom: "24px" }}>
          <Title level={3}>Contact Information</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Paragraph style={{ fontSize: "16px" }}>
                <strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a>
              </Paragraph>
            </Col>
            <Col xs={24} sm={12}>
              <Paragraph style={{ fontSize: "16px" }}>
                <strong>Phone:</strong> <a href="tel:+11234567890">+1 (123) 456-7890</a>
              </Paragraph>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CustomerAffairsPage;
