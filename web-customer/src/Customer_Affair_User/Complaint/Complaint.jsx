import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const RaiseComplaintPage = () => {
  const [form] = Form.useForm();
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const onFinish = (values) => {
    // Handle form submission, including attachmentFiles
    console.log("Form values:", values);
    console.log("Attachment files:", attachmentFiles);
    message.success("Complaint submitted successfully!");
  };

  const handleFileUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-3); // Limit to 3 files
    setAttachmentFiles(fileList);
  };

  // Custom validation for the name field
  const validateName = (_, value) => {
    if (!value || !/^[a-zA-Z\s]*$/.test(value)) {
      return Promise.reject("Please enter a valid name without symbols or numbers.");
    }
    return Promise.resolve();
  };

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Title level={2} style={{ marginBottom: "20px" }}>
          Raise a Complaint
        </Title>
        <Text style={{ marginBottom: "20px", display: "block" }}>
          We value your feedback and will address your concerns promptly.
        </Text>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Your Name"
            rules={[
              { required: true, message: "Please enter your name" },
              { validator: validateName },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Your Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Your Phone Number"
            rules={[
              {
                pattern: /^[0-9\b]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Complaint Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              <Option value="product">Product Issue</Option>
              <Option value="service">Service Issue</Option>
              <Option value="billing">Billing Issue</Option>
              <Option value="general">General Inquiry</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="details"
            label="Complaint Details"
            rules={[
              { required: true, message: "Please provide complaint details" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="attachments"
            label="Attachments"
            valuePropName="fileList"
            getValueFromEvent={handleFileUpload}
          >
            <Upload
              multiple={true}
              maxCount={3}
              fileList={attachmentFiles}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Complaint
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default RaiseComplaintPage;
