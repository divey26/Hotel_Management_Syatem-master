import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  message,
  DatePicker,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import LayoutNew from "../Layout";

const { Title } = Typography;
const { Content } = Layout;

const LeaveTrackingPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchText, setSearchQuery] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const token = localStorage.getItem("userId");
  const userType = localStorage.getItem("loggedInUserType");

  const [loggedInUserType, setLoggedInUserType] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  const fetchData = async () => {
    let apiUrl;
    if (userType === "admin") {
      apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`; // Fetch all leave requests for admins
    } else {
      apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/user/${token}`; // Fetch leave requests for specific user
    }
    try {
      const response = await axios.get(apiUrl);
      setData(
        response.data.data.map((item, index) => ({
          key: index.toString(),
          ...item,
          startDate: moment(item.startDate).format("YYYY-MM-DD"),
          endDate: moment(item.endDate).format("YYYY-MM-DD"),
        }))
      );
    } catch (error) {
      message.error(`Failed to fetch data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchText) {
      const filteredData = data.filter(
        (leave) =>
          leave.employee.toLowerCase().includes(searchText.toLowerCase()) ||
          leave.status.toLowerCase().includes(searchText.toLowerCase()) ||
          leave.reason.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    } else {
      fetchData();
    }
  }, [searchText]);

  const columns = [
    ...(userType === "admin"
      ? [
          {
            title: "Employee",
            dataIndex: "employee",
            key: "employee",
          },
        ]
      : []),
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "gold"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          {userType === "admin" && (
            <Button onClick={() => approveRequest(record._id)}>Approve</Button>
          )}
          {userType === "user" &&
            (record.status === "Rejected" || record.status === "Pending") && (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => edit(record.key)}
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => confirmDelete(record.key)}
                />
              </>
            )}
        </Space>
      ),
    },
  ];

  const approveRequest = async (_id) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/${_id}`;
    const updatePayload = {
      status: "Approved",
    };

    try {
      // Sending the update payload in the request body
      await axios.put(apiUrl, updatePayload);
      // Optionally update the local data to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item._id === _id ? { ...item, status: "Approved" } : item
        )
      );
      message.success("Leave request approved successfully");
    } catch (error) {
      message.error(`Failed to approve leave request: ${error.message}`);
    }
  };

  const edit = (key) => {
    const record = data.find((item) => item.key === key);
    if (record) {
      form.setFieldsValue({
        startDate: moment(record.startDate),
        endDate: moment(record.endDate),
        reason: record.reason,
      });
      setEditingKey(key); // This tells us that the form is in edit mode
    }
  };

  const confirmDelete = (key) => {
    const record = data.find((item) => item.key === key);
    if (record) {
      Modal.confirm({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this leave request?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => deleteItem(record._id), // Passing the actual _id to deleteItem
      });
    }
  };

  const deleteItem = async (_id) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`;
    try {
      await axios.delete(`${apiUrl}${_id}`);
      setData((prevData) => prevData.filter((item) => item._id !== _id)); // Update state to reflect the change
      message.success("Leave request deleted successfully");
    } catch (error) {
      message.error(`Failed to delete leave request: ${error.message}`);
    }
  };
  const onFinish = async (values) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`;
    if (editingKey !== "") {
      // Update logic
      const record = data.find((item) => item.key === editingKey);
      if (record) {
        try {
          await axios.put(`${apiUrl}${record._id}`, {
            ...values,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
          });
          message.success("Leave request updated successfully");
          setData((prevData) =>
            prevData.map((item) =>
              item.key === editingKey ? { ...item, ...values } : item
            )
          );
          setEditingKey(""); // Reset editing state
          form.resetFields();
        } catch (error) {
          message.error(`Failed to update leave request: ${error.message}`);
        }
      }
    } else {
      // Insert logic
      try {
        const response = await axios.post(apiUrl, {
          ...values,
          employee: token,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        });
        setData([...data, { key: data.length.toString(), ...response.data }]);
        message.success("Leave request added successfully");
        fetchData();
      } catch (error) {
        message.error(`Failed to add leave request: ${error.message}`);
      }
    }
  };

  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Title level={2} style={{ marginBottom: 20 }}>
            Leave Tracking
          </Title>
          {userType !== "admin" && (
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Reason for Leave"
                rules={[
                  {
                    required: true,
                    message: "Please input the reason for leave!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Describe the reason for leave" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingKey !== "" ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          )}
          {/* Search input */}
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            onChange={handleSearchInputChange}
            style={{ marginRight: "8px", marginBottom: "10px" }}
          />
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default LeaveTrackingPage;
