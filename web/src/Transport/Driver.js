import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Space,
  Button,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import DriverForm from "./AddEditDriver";
import axios from "axios";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const DriverManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddDriverModalVisible, setIsAddDriverModalVisible] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/drivers`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const transformedRows = data.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);

  const filterData = () => {
    setFilteredData(data);
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    filterData();
  };

  const addNewDriver = () => {
    setIsAddDriverModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddDriverModalVisible(false);
    setEditingDriver(null);
    form.resetFields();
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this driver?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/drivers/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Driver deleted successfully");
      fetchDrivers();
    }
  };

  const handleEdit = (driver) => {
    console.log(driver);
    setEditingDriver(driver);
    setIsAddDriverModalVisible(true);
    form.setFieldsValue({
      firstName: driver.firstName,
      lastName: driver.lastName,
      phone: driver.phone,
      address: driver.address,
      city: driver.city,
      state: driver.state,
      country: driver.country,
      zipCode: driver.zipCode,
      drivingLicenseNo: driver.drivingLicenseNo,
    });
  };

  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "city", headerName: "City", width: 120 },
    { field: "state", headerName: "State", width: 120 },
    { field: "country", headerName: "Country", width: 120 },
    { field: "zipCode", headerName: "Zip Code", width: 120 },
    { field: "drivingLicenseNo", headerName: "Driving License No", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleEdit(params.row)}
            icon={<EditOutlined style={{ color: "blue" }} />}
          />
          <Button
            onClick={() => confirmDelete(params.row.id)}
            icon={<DeleteOutlined style={{ color: "red" }} />}
          />
        </div>
      ),
    },
  ];

  const onFinish = (values) => {
    onFinishAddDriver(values);
  };

  const onFinishAddDriver = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingDriver) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/drivers/${editingDriver.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/drivers/`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      if (response.data.success) {
        form.resetFields();
        setIsAddDriverModalVisible(false);
        const statusText = editingDriver ? "updated" : "added";
        message.success(`Driver ${statusText} successfully`);
        fetchDrivers();
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
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
        <Content style={{ padding: "24px" }}>
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
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
              >
                Driver Management
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewDriver}
              >
                Add New Driver
              </Button>
            </div>
          </Space>
          <br />
          <br />
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Search input */}
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearchInputChange}
              style={{ marginRight: "8px" }}
            />
          </div>
          <DataGrid
            rows={sortedRows}
            columns={columns}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            sortModel={[
              {
                field: "number",
                sort: "asc",
              },
            ]}
          />
          <Modal
            open={isAddDriverModalVisible}
            title={editingDriver ? "Edit Driver" : "Add New Driver"}
            okText={editingDriver ? "Update" : "Save"}
            cancelText="Cancel"
            onCancel={handleCancel}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  onFinish(values);
                })
                .catch((errorInfo) => {
                  console.log("Validation Failed:", errorInfo);
                });
            }}
          >
            <DriverForm form={form} onFinish={onFinish} />
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default DriverManagementPage;
