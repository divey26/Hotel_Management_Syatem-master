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
  const empid = localStorage.getItem("empid");

  const userType = localStorage.getItem("loggedInUserType");

  const [loggedInUserType, setLoggedInUserType] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);
  const validateCheckInDate = (_, value) => {
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Check-in date cannot be in the past");
    }
    return Promise.resolve();
  };
  const validateCheckOutDate = (_, value) => {
    const checkInDate = form.getFieldValue("checkInDate");
    if (value && checkInDate && value.isBefore(checkInDate, "day")) {
      return Promise.reject("Check-out date must be after check-in date");
    }
    if (value && value.isBefore(new Date(), "day")) {
      return Promise.reject("Check-out date cannot be in the past");
    }
    return Promise.resolve();
  };
  const fetchData = async () => {
    try {
      let apiUrl;
      if (userType === "admin") {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/`; // Fetch all leave requests for admins
        const response = await axios.get(apiUrl);
        const modifiedData = await Promise.all(
          response.data.data.map(async (item, index) => {
            let employeeName = ""; // Initialize employee name to an empty string
            if (item.employee) { // Check if employeeId exists
              const employeeResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${item.employee}`
              );
              const employee = employeeResponse.data.data;
              employeeName = `${employee.firstName} ${employee.lastName}`;
            }
            return {
              ...item,
              key: index.toString(),
              employeeName: employeeName,
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.endDate).format("YYYY-MM-DD"),
            };
          })
        );
        setData(modifiedData);
      } else {
        apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/user/${empid}`; // Fetch leave requests for specific user
        const response = await axios.get(apiUrl);
        const modifiedData = response.data.data.map((item, index) => ({
          ...item,
          key: index.toString(),
          startDate: moment(item.startDate).format("YYYY-MM-DD"),
          endDate: moment(item.endDate).format("YYYY-MM-DD"),
        }));
        setData(modifiedData);
      }
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
          (leave.employeeName && leave.employeeName.toLowerCase().includes(searchText.toLowerCase())) ||
          (leave.reason && leave.reason.toLowerCase().includes(searchText.toLowerCase())) ||
          (leave.startDate && leave.startDate.includes(searchText)) ||
          (leave.endDate && leave.endDate.includes(searchText))
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
            title: "Employee Name",
            dataIndex: "employeeName",
            key: "employeeName",
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
          {(userType === "admin" && record.status == "Pending") && (
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
          fetchData();
        } catch (error) {
          message.error(`Failed to update leave request: ${error.message}`);
        }
      }
    } else {
      // Insert logic
      try {
        console.log(empid);
        const response = await axios.post(apiUrl, {
          ...values,
          employee: empid,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        });
        setData([...data, { key: data.length.toString(), ...response.data }]);
        message.success("Leave request added successfully");
        fetchData();
        form.resetFields();
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
                  { validator: validateCheckInDate },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date!" },
                { validator: validateCheckOutDate },
                ]}
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
