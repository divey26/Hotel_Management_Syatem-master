import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, Alert, Tag } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/complaints');
        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchComplaints();
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        let color = 'blue';
        if (category === 'product') {
          color = 'volcano';
        } else if (category === 'service') {
          color = 'geekblue';
        } else if (category === 'billing') {
          color = 'gold';
        }
        return (
          <Tag color={color}>{category.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
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
      <Title level={2} style={{ marginBottom: '20px', textAlign: 'center' }}>All Complaints</Title>
      <Table dataSource={complaints} columns={columns} />
    </div>
  );
};

export default ComplaintList;
