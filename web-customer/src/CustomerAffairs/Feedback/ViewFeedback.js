import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, Alert, Tag } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/feedback');
        const formattedFeedbacks = response.data.map(feedback => ({
          ...feedback,
          checkInDate: new Date(feedback.checkInDate).toLocaleDateString(),
          checkOutDate: new Date(feedback.checkOutDate).toLocaleDateString()
        }));
        setFeedbacks(formattedFeedbacks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Check-in Date',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
    },
    {
      title: 'Check-out Date',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
    },
    {
      title: 'Cleanliness Rating',
      dataIndex: 'cleanlinessRating',
      key: 'cleanlinessRating',
      render: (rating) => (
        <Tag color={rating > 4 ? 'green' : rating > 2 ? 'gold' : 'red'}>{rating}</Tag>
      ),
    },
    {
      title: 'Staff Friendliness Rating',
      dataIndex: 'staffFriendlinessRating',
      key: 'staffFriendlinessRating',
      render: (rating) => (
        <Tag color={rating > 4 ? 'green' : rating > 2 ? 'gold' : 'red'}>{rating}</Tag>
      ),
    },
    {
      title: 'Amenities Rating',
      dataIndex: 'amenitiesRating',
      key: 'amenitiesRating',
      render: (rating) => (
        <Tag color={rating > 4 ? 'green' : rating > 2 ? 'gold' : 'red'}>{rating}</Tag>
      ),
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Suggestions',
      dataIndex: 'suggestions',
      key: 'suggestions',
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>All Feedbacks</Title>
      <Table dataSource={feedbacks} columns={columns} />
    </div>
  );
};

export default FeedbackList;
