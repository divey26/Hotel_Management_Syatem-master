import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Modal, message, Space, Input } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { formatDate } from "../Common/date";

const { Title } = Typography;
const { Content } = Layout;

const PaymentsPage = () => {
  const [data, setData] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/payments`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetch payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const exportToExcel = () => {
    message.success("Exported to Excel successfully");
  };
  // Export to PDF function
  const exportToPDF = () => {
    message.success("Exported to PDF successfully");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const transformedRows = data.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const filteredData = transformedRows.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const customHeaderStyle = {
    backgroundColor: "#001529", // Change this to your desired color
  };
  const columns = [
    {
      field: "user",
      headerName: "Customer",
      width: 200,
      renderCell: (params) => {
        const ID = params.value._id;
        const Name = params.value.firstName + " " + params.value.lastName;
        return (
          <div style={{ height: "100%", lineHeight: "normal" }}>
            <p style={{ margin: 0, lineHeight: "1.5" }}>ID: {ID}</p>
            <p style={{ margin: 0, lineHeight: "1.5" }}>Name: {Name}</p>
          </div>
        );
      },
    },
    {
      field: "order",
      headerName: "Order ID",
      width: 200,
      renderCell: (params) => {
        return params.value?._id;
      },
    },
    {
      field: "booking",
      headerName: "Booking ID",
      width: 200,
      renderCell: (params) => {
        return params.value?._id;
      },
    },
    {
      field: "paidOn",
      headerName: "Paid On",
      width: 150,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    { field: "paidVia", headerName: "Paid Via", width: 130 },
    { field: "totalPrice", headerName: "Amount", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "Received"
                ? "green"
                : params.value === "Declined"
                ? "red"
                : "inherit",
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];

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
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
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
                <CheckCircleOutlined
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
                <Title
                  level={2}
                  style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
                >
                  Payments
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

              {/* Empty space to push buttons to the right */}
              <div style={{ flex: 1 }}></div>

              {/* Export buttons */}
              <Space>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  onClick={exportToExcel}
                >
                  Export to Excel
                </Button>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={exportToPDF}
                >
                  Export to PDF
                </Button>
              </Space>
            </div>

            <div style={{ overflowX: "auto", width: "100%" }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                headerClassName={customHeaderStyle}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default PaymentsPage;
