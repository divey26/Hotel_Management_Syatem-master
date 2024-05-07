//Details.js
import React, {  useEffect, useState } from "react";

import { useParams } from 'react-router-dom';
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
import StockForm from "./AddEditStock";
import axios from "axios";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const DetailsPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const { scannedValue } = useParams();
  const scannedQuery=scannedValue;
  const [searchQuery, setSearchQuery] = useState(scannedQuery);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState(null);



  const fetchStocks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/stocks`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      message.error("Failed to fetch stocks");
    }
  };


  useEffect(() => {
    fetchStocks();
  }, []);

  const transformData = (data) =>
  data.map((row) => ({
    id: row._id.toString(),
    ...row,
  }));

  const sortedData = [...data].sort((a, b) => a.number - b.number);
  const filterData = () => {
    const filtered = data.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const idMatch = row._id.toLowerCase().includes(searchQuery.toLowerCase()); // Include searching by _id

      const depMatch = row.department.name.toLowerCase().includes(searchQuery.toLowerCase());
  
      return orderAttributesMatch || depMatch || idMatch;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery, sortedData]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addNewStock = () => {
    setIsAddStockModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddStockModalVisible(false);
    setEditingStock(null);
    form.resetFields();
  };


  //msg for delete
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this stock?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };




  //for delete
  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/stocks/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      message.success("Stock deleted successfully");
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock:", error);
      message.error("Failed to delete stock");
    }
  };

  //for edit
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setIsAddStockModalVisible(true);
    form.setFieldsValue({
      name: stock.name,
      department: stock.department._id,
      description: stock.description,
      unit: stock.unit,
      quantity: stock.quantity,
      category: stock.category,
      price: stock.price,
    });
  };
 

  //table
  const columns = [
    {
      field: "department",
      headerName: "Department",
      width: 150,
      renderCell: (params) => params.value.name,
    },
    { field: "stockId", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "unit", headerName: "Unit", width: 100 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "category", headerName: "Category", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
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
    onFinishAddStock(values);
  };


  //to add stocks
  const onFinishAddStock = async (values) => {
    try {
      let response;
      if (editingStock) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/stocks/${editingStock.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/stocks/`,
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
        setIsAddStockModalVisible(false);
        const statusText = editingStock ? "updated" : "added";
        message.success(`Stock ${statusText} successfully`);
        fetchStocks();
      }
    } catch (error) {
      console.error("Error adding/updating stock:", error);
      message.error(error.response?.data?.message || "Failed to save stock");
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
                Stock Management
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewStock}
              >
                Add New Stock
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
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearchInputChange}
              style={{ marginRight: "8px" }}
            />
          </div>

         <DataGrid
         rows={transformData(filteredData)}
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
            open={isAddStockModalVisible}
            title={editingStock ? "Edit Stock" : "Add New Stock"}
            okText={editingStock ? "Update" : "Save"}
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
            <StockForm form={form} onFinish={onFinish} />
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default DetailsPage;
