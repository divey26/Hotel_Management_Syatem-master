import React, { useState, useEffect } from 'react';
import { Layout, Typography, Form, Input, Select,Button, Table, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarCircleOutlined ,CheckOutlined} from '@ant-design/icons';
import LayoutNew from "../Layout";
const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const PayrollPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    { key: '1', date: '2022-03-01', overTime: '2 hours', allowance: '$100', performanceBonus: '$500', totalSalary: '$2000' },
    { key: '2', date: '2022-03-02', overTime: '1 hour', allowance: '$50', performanceBonus: '$300', totalSalary: '$1800' },
    // Add more sample data as needed
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isEditing = (record) => record.key === editingKey;

  // Function to handle edit action
  const edit = (key) => {
    const record = data.find((item) => item.key === key);
    if (record) {
      setFormValues(record);
      setEditingKey(key);
    }
  };

  // Function to handle cancel action
  const cancel = () => {
    setEditingKey("");
  };

  // Function to handle save action
  const save = (key) => {
    // Implement save logic here
    setEditingKey("");
  };
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' ,editable: true,
    render: (text, record) => renderCell(text, record, "date"),},
    { title: 'Over Time', dataIndex: 'overTime', key: 'overTime',editable: true,
    render: (text, record) => renderCell(text, record, "overTime"), },
    { title: 'Allowance', dataIndex: 'allowance', key: 'allowance',editable: true,
    render: (text, record) => renderCell(text, record, "allowance"), },
    { title: 'Performance Bonus', dataIndex: 'performanceBonus', key: 'performanceBonus',editable: true,
    render: (text, record) => renderCell(text, record, "performanceBonus"), },
    { title: 'Total Salary', dataIndex: 'totalSalary', key: 'totalSalary',editable: true,
    render: (text, record) => renderCell(text, record, "totalSalary"), },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => save(record.key)}
              />
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(record.key)} // Confirm delete
              />
            </Space>
          ) : (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => edit(record.key)} />
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(record.key)}
              />
            </Space>
          );
        },
    },
  ];
  const [formValues, setFormValues] = useState({});
  const [employees, setEmployees] = useState([]); // Employee data
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const onFinish = (values) => {
    const newData = { ...values };
    setData([...data, newData]);
    form.resetFields();
    message.success('Data added successfully');
  };

 
  const users = [
    { id: 1, username: "John Doe" },
    { id: 2, username: "Jane Smith" },
    { id: 3, username: "Alice Johnson" },
    { id: 4, username: "Bob Williams" },
    { id: 5, username: "Emily Brown" },
  ];
  const confirmDelete = (key) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this item?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => deleteItem(key),
    });
  };

  const deleteItem = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));
    message.success('Item deleted successfully');
  };
  const renderCell = (text, record, dataIndex) => {
    const editable = isEditing(record);
    return editable ? (
      <Input
        value={formValues[dataIndex]}
        onChange={(e) => handleInputChange(e, dataIndex)}
        onPressEnter={() => save(record.key)}
      />
    ) : (
      text
    );
  };
  const handleInputChange = (e, dataIndex) => {
    const { value } = e.target;
    setFormValues({ ...formValues, [dataIndex]: value });
  };

  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <Content style={{ padding: '24px' }}>
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
            <DollarCircleOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
            <Title
              level={2}
              style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
            >
              Payroll & Benefits Administration
            </Title>
          </Space>
        </Space>
        <br /><br />
        <Select
              defaultValue="Select User"
              style={{ width: "85%", marginBottom: "16px" }}
              placeholder="Select User"
            >
              {users.map((user) => (
                <Option key={user.id}>{user.username}</Option>
              ))}
            </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ marginBottom: '16px',marginLeft: '8px'}}
          >
            Add Item
          </Button>
          <Modal
            title="Add Item"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="overTime"
                label="Over Time"
                rules={[{ required: true, message: 'Please input Over Time!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="allowance"
                label="Allowance"
                rules={[{ required: true, message: 'Please input Allowance!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="performanceBonus"
                label="Performance Bonus"
                rules={[{ required: true, message: 'Please input Performance Bonus!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            rowClassName="editable-row"
          />
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default PayrollPage;
