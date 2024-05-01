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
  Tooltip,
} from "antd";
import {
  StockOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { formatDate } from "../Common/date";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const AdditionalServiceRequestManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data

  const fetchAdditionalServiceRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching Additional Services:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalServiceRequests();
  }, []);

  const transformedRows = data.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);

  const exportToExcel = () => {
    message.success("Exported to Excel successfully");
  };
  // Export to PDF function
  const exportToPDF = () => {
    message.success("Exported to PDF successfully");
  };
  const filterData = () => {
    setFilteredData(data);
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    // setSearchQuery(e.target.value);
    filterData();
  };

  const handleConfirmation = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to confirm this request?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => confirmRequest(id),
    });
  };

  const confirmRequest = async (id) => {
    const payload = {
      status: "Confirmed",
    };
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/${id}`,
      payload
    );
    if (response.data.success) {
      message.success("Request confirmed successfully");
      fetchAdditionalServiceRequests();
    }
  };

  const handleCancel = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to cancel this request?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => cancelRequest(id),
    });
  };

  const cancelRequest = async (id) => {
    const payload = {
      status: "Cancelled",
    };
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/${id}`,
      payload,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Request cancelled successfully");
      fetchAdditionalServiceRequests();
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this request?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("AdditionalServiceRequest deleted successfully");
      fetchAdditionalServiceRequests();
    }
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
      field: "service",
      headerName: "Service",
      width: 150,
      renderCell: (params) => {
        return params.value.name;
      },
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 130,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    { field: "noOfPersons", headerName: "No Of Persons", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        let statusColor = "";
        switch (params.value) {
          case "Pending":
            statusColor = "orange";
            break;
          case "Confirmed":
            statusColor = "green";
            break;
          case "Cancelled":
            statusColor = "red";
            break;
          default:
            statusColor = "black";
        }
        return <span style={{ color: statusColor }}>{params.value}</span>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.status === "Pending" && (
            <>
              <Tooltip title="Confirm request">
                <Button
                  icon={<CheckCircleOutlined style={{ color: "green" }} />}
                  onClick={() => handleConfirmation(params.row.id)}
                />
              </Tooltip>

              <Tooltip title="Cancel request">
                <Button
                  icon={<CloseCircleOutlined style={{ color: "red" }} />}
                  onClick={() => handleCancel(params.row.id)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Delete request">
            <Button
              onClick={() => confirmDelete(params.row.id)}
              icon={<DeleteOutlined style={{ color: "red" }} />}
            />
          </Tooltip>
        </div>
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
                Additional Service Request Management
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
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default AdditionalServiceRequestManagementPage;
