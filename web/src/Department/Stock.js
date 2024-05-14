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
  notification
} from "antd";
import {
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import StockForm from "./AddEditStock";
import Summa from "./summa"
import axios from "axios";
import "jspdf-autotable";
import { exportToPDF } from "../Common/report";
const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const StockManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [stockIdForQR, setStockIdForQR] = useState(null);

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
//const sortedRows = [...transformedRows].sort((a, b) => a.stockId.localeCompare(b.stockId));
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
      const idMatch = row._id.toLowerCase().includes(searchQuery.toLowerCase()); // Include searching by _id

      const depMatch = row.department.name.toLowerCase().includes(searchQuery.toLowerCase());
  
      return orderAttributesMatch || depMatch || idMatch;
    });
    setFilteredData(filtered);
  };
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  const addNewStock = () => {
    setIsAddStockModalVisible(true);
  };
  const GenQr = (id) => {
    setStockIdForQR(id); // Set the stockId for QR code
    setIsQRModalVisible(true); // Open the QR modal
  };
  

  const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "action" && col.field !== "imageUrls"
    );
    const prepareDataForReport = (data) => {
      return data.map((order) => {
        const rowData = {};
        const depName = `${order.department.name} `;

       

        columnsToExport.forEach((col) => {
         if (col.field === "department") {
            rowData[col.field] = depName;
          } else {
            rowData[col.field] = order[col.field];
          }
        });
        return rowData;
      });
    };
    const reportData = prepareDataForReport(filteredData);
    exportToPDF(columnsToExport, reportData, {
      title: "Stock Report",
    });
  };
  const handleCancel = () => {
    setIsAddStockModalVisible(false);
    setEditingStock(null);
    form.resetFields();
  };

  const handleQrCancel = () => {
    setIsQRModalVisible(false);
 
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this stock?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/stocks/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Stock deleted successfully");
      fetchStocks();
    }
  };

  const handleEdit = (stock) => {
    console.log(stock);
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
  const checkStockQuantity = () => {
    // Loop through each stock item
    data.forEach((item) => {
      // If the quantity is less than 2, show notification
      if (item.quantity < 5) {
        notification.warning({
          message: `Low Stock Alert`,
          description: `${item.name} (ID: ${item.stockId}) has low stock (${item.quantity})`,
        });
      }
    });
  };

  useEffect(() => {
    checkStockQuantity();
  }, [data]);

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 150 },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      renderCell: (params) => {
        return params.value.name;
      },
    },
    { field: "name", headerName: "Name", width: 100 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "unit", headerName: "Unit", width: 100 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `RS ${params.value.toFixed(2)}`,
    },
    { field: "quantity", headerName: "Quantity", width: 100 },
     {
    field: "category",
    headerName: "Total",
    width: 100,
    renderCell: (params) => `Rs ${params.value}`,
  },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => GenQr(params.row.id)}
            icon={<QrcodeOutlined style={{ color: "black" }} />}
          />
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
      let response = null;
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
            <Space>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={generatePDF}
              >
                Export to PDF
              </Button>
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
                onClick={addNewStock}
              >
                Add New Stock
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
          <Modal
            open={isQRModalVisible}
            onCancel={handleQrCancel}
          >
            <Summa stockId={stockIdForQR} /> {/* Pass the stockId as a prop */}
          </Modal>

        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default StockManagementPage;
