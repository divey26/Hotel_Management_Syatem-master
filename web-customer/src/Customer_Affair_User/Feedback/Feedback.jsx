import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Typography, InputNumber, message } from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons"; // Import additional icons

const { Title } = Typography;

const FeedbackForm = ({ onFinish }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    cleanlinessRating: '',
    staffFriendlinessRating: '',
    amenitiesRating: '',
    comments: '',
    suggestions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (formData.checkOutDate <= formData.checkInDate) {
      message.error('Check-out date must be after the check-in date');
      return;
    }

    // Mock API call to save data to the database
    try {
      // Assuming there's an API function called saveFeedbackData
      await saveFeedbackData(formData);
      message.success('Feedback submitted successfully');
      setFormData({
        name: '',
        email: '',
        checkInDate: '',
        checkOutDate: '',
        cleanlinessRating: '',
        staffFriendlinessRating: '',
        amenitiesRating: '',
        comments: '',
        suggestions: ''
      });
    } catch (error) {
      message.error('Failed to submit feedback');
    }
  };

  const saveFeedbackData = async (formData) => {
    // Mock API call to save data to the database
    // Replace this with your actual API call
    return new Promise((resolve, reject) => {
      // Simulating API call delay with setTimeout
      setTimeout(() => {
        // Resolve to mock successful API call
        resolve();
      }, 1000); // Simulating 1 second delay
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "8px", backgroundColor: "#ffffff" }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>Give Your Feedback Here</Title>
      <Form
        name="feedbackForm"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please input your name!' },
            { pattern: /^[a-zA-Z\s]*$/, message: 'Please enter a valid name without symbols or numbers.' }
          ]}
        >
          <Input placeholder="Enter Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address.' }
          ]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>

        <Form.Item label="Check-in Date" name="checkInDate">
          <DatePicker style={{ width: "100%" }} onChange={(date, dateString) => setFormData({...formData, checkInDate: dateString})} />
        </Form.Item>

        <Form.Item label="Check-out Date" name="checkOutDate" dependencies={['checkInDate']}
          rules={[
            { required: true, message: 'Please select check-out date!' },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue('checkInDate') < value) {
                  return Promise.resolve();
                }
                return Promise.reject('Check-out date must be after the check-in date');
              },
            }),
          ]}
        >
          <DatePicker style={{ width: "100%" }} onChange={(date, dateString) => setFormData({...formData, checkOutDate: dateString})} />
        </Form.Item>

        <Form.Item label="Cleanliness Rating" name="cleanlinessRating">
          <InputNumber min={0} max={5} onChange={(value) => setFormData({...formData, cleanlinessRating: value})} />
        </Form.Item>

        <Form.Item label="Staff Friendliness Rating" name="staffFriendlinessRating">
          <InputNumber min={0} max={5} onChange={(value) => setFormData({...formData, staffFriendlinessRating: value})} />
        </Form.Item>

        <Form.Item label="Amenities Rating" name="amenitiesRating">
          <InputNumber min={0} max={5} onChange={(value) => setFormData({...formData, amenitiesRating: value})} />
        </Form.Item>

        <Form.Item label="Comments" name="comments">
          <Input.TextArea placeholder="Enter comments" onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Suggestions for Improvement" name="suggestions">
          <Input.TextArea placeholder="Suggestions for improvement" onChange={handleInputChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FeedbackForm;
