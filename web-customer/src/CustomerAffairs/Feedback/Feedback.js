import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Typography, InputNumber, message, Modal, Rate } from "antd";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const FeedbackForm = ({ onFinish }) => {
  const { _id } = useParams();
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});
  const [successVisible, setSuccessVisible] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateCheckOutDate = (_, value) => {
    const checkInDate = formData.checkInDate;
    if (value && checkInDate && value.isBefore(checkInDate, "day")) {
      return Promise.reject("Check-out date must be after check-in date");
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:8000/api/feedback", values);
      if (response.status === 201) {
        message.success('Feedback submitted successfully');
        setSuccessVisible(true);
      }
    } catch (error) {
      message.error('Failed to submit feedback. Please try again later.');
    }
  };
  
  const handleOk = () => {
    setSuccessVisible(false); // Close success modal
    navigate(`/viewfeedback`); // Navigate to the feedback view page
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "8px", backgroundColor: "#ffffff" }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>Share Your Experience</Title>
      <Form
        name="feedbackForm"
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData} // Set initial form values
      >
        <Form.Item
          label="Your Name"
          name="name"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
          rules={[
            { required: true, message: 'Please input your name!' },
            { pattern: /^[a-zA-Z\s]+$/, message: 'Name should contain only letters and spaces' }
          ]}
        >
          <Input placeholder="Enter Your Name" onChange={(e) => handleInputChange("name", e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Your Email"
          name="email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input placeholder="Enter Your Email" onChange={(e) => handleInputChange("email", e.target.value)} />
        </Form.Item>

        <Form.Item label="Check-in Date" name="checkInDate" 
          rules={[
            { required: true, message: 'Please select check-in date!' },
          ]}
        >
          <DatePicker style={{ width: "100%" }} onChange={(date, dateString) => handleInputChange("checkInDate", dateString)} />
        </Form.Item>

        <Form.Item label="Check-out Date" name="checkOutDate" dependencies={['checkInDate']}
          rules={[
            { required: true, message: 'Please select check-out date!' },
            { validator: validateCheckOutDate },
          ]}
        >
          <DatePicker style={{ width: "100%" }} onChange={(date, dateString) => handleInputChange("checkOutDate", dateString)} disabledDate={current => current && current < formData.checkInDate} />
        </Form.Item>

        <Form.Item label="Cleanliness Rating" name="cleanlinessRating"
          
          
        >
          <Rate onChange={(value) => handleInputChange("cleanlinessRating", value)} />
          
        </Form.Item>

        <Form.Item label="Staff Friendliness Rating" name="staffFriendlinessRating">
          <Rate onChange={(value) => handleInputChange("staffFriendlinessRating", value)} />
        </Form.Item>

        <Form.Item label="Amenities Rating" name="amenitiesRating">
          <Rate onChange={(value) => handleInputChange("amenitiesRating", value)} />
        </Form.Item>

        <Form.Item label="Comments" name="comments">
          <Input.TextArea placeholder="Enter comments" onChange={(e) => handleInputChange("comments", e.target.value)} />
        </Form.Item>

        <Form.Item label="Suggestions for Improvement" name="suggestions">
          <Input.TextArea placeholder="Suggestions for improvement" onChange={(e) => handleInputChange("suggestions", e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>Submit</Button>
        </Form.Item>
      </Form>
      <Modal
        title="Feedback Submitted Successfully"
        visible={successVisible}
        onOk={handleOk}
        onCancel={() => setSuccessVisible(false)}
      >
        <p>Your feedback has been submitted successfully!</p>
      </Modal>
    </div>
  );
};

export default FeedbackForm;
