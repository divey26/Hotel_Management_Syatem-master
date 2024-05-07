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
import SupplierForm from "./AddEditSupplier";
import axios from "axios";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const SupplierManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddSupplierModalVisible, setIsAddSupplierModalVisible] =
    useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/suppliers`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);

  const filterData = () => {
    const filtered = data.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      return orderAttributesMatch ;
    });
    setFilteredData(filtered);
  };
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  const addNewSupplier = () => {
    setIsAddSupplierModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddSupplierModalVisible(false);
    setEditingSupplier(null);
    form.resetFields();
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this supplier?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/suppliers/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Supplier deleted successfully");
      fetchSuppliers();
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsAddSupplierModalVisible(true);
    form.setFieldsValue({
      name: supplier.name,
      contact: supplier.contact,
      address: supplier.address,
    });
  };

  const columns = [
    { field: "supplierId", headerName: "Supplier ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
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
    onFinishAddSupplier(values);
  };

  const onFinishAddSupplier = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingSupplier) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/suppliers/${editingSupplier.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/suppliers/`,
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
        setIsAddSupplierModalVisible(false);
        const statusText = editingSupplier ? "updated" : "added";
        message.success(`Supplier ${statusText} successfully`);
        fetchSuppliers();
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const [loggedInUserType, setLoggedInUserType] = useState("");

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
                Supplier Management
              </Title>
            </Space>
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
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewSupplier}
              >
                Add New Supplier
              </Button>
            </div>
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
            open={isAddSupplierModalVisible}
            title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            okText={editingSupplier ? "Update" : "Save"}
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
            <SupplierForm form={form} onFinish={onFinish} />
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default SupplierManagementPage;
