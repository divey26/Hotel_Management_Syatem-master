import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Modal,
  Space,
  Input,
  notification,
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { formatDate } from "../Common/date";
import { exportToPDF } from "../Common/report";

const { Title } = Typography;
const { Content } = Layout;

const BookingsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { field: "bookingId", headerName: "Booking ID", width: 150 },
    {
      field: "user",
      headerName: "Customer",
      width: 200,
      renderCell: (params) => {
        if (!params.value || !params.value.customerId) {
          return null; // Or handle the case when customerId is not available
        }
        const ID = params.value.customerId;
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
      field: "room",
      headerName: "Room",
      width: 200,
      renderCell: (params) => {
        if (!params.value || !params.value.number) {
          return null; // Or handle the case when params.value or params.value.number is null
        }
        const roomNumber = params.value.number;
        const roomPrice = params.value.price;
        return (
          <div style={{ height: "100%", lineHeight: "normal" }}>
            <p style={{ margin: 0, lineHeight: "1.5" }}>No: {roomNumber}</p>
            <p style={{ margin: 0, lineHeight: "1.5" }}>
              Price per day: {roomPrice} LKR
            </p>
          </div>
        );
      },
      
    },
    {
      field: "checkInDate",
      headerName: "Check-in Date",
      width: 150,
    
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toDateString();
        return formattedDate;
      },
    },
    {
      field: "checkOutDate",
      headerName: "Check-out Date",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toDateString();
        return formattedDate;
      },
    },
    { field: "numberOfGuests", headerName: "Number of Guests", width: 100 },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => {
        const bookingStatus = params.row.status;
        let paymentStatus = "";
        let statusColor = "";
        switch (bookingStatus) {
          case "Pending":
            paymentStatus = "Unpaid";
            statusColor = "orange";
            break;
          case "Confirmed":
            paymentStatus = "Paid";
            statusColor = "green";
            break;
          case "Cancelled":
            paymentStatus = "Need a refund";
            statusColor = "red";
            break;
        }
        return <span style={{ color: statusColor }}>{paymentStatus}</span>;
      },
    },
    {
      field: "status",
      headerName: "Booking Status",
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
      width: 200,
      renderCell: (params) => (
        <strong>
          {params.row.status === "Pending" && (
            <Button
              type="link"
              icon={
                <CheckCircleOutlined
                  style={{ color: "green", fontSize: "30px" }}
                />
              }
              onClick={() => handleBookingConfirmation(params.row)}
              style={{ padding: "0" }}
              size="large"
            />
          )}
          {params.row.status === "Confirmed" && (
            <Button
              type="link"
              icon={
                <CloseCircleOutlined
                  style={{ color: "red", fontSize: "30px" }}
                />
              }
              onClick={() => handleCancelConfirmation(params.row)}
              style={{ padding: "0" }}
              size="large"
            />
          )}
        </strong>
      ),
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = data
      .map((row) => ({ id: row._id, ...row }))
      .filter((row) => {
        const searchTerms = [
          row._id,
          `${row.user?.firstName} ${row.user?.lastName}`,
          row.room?.number?.toString(),
          row.paymentStatus,
          row.status,
        ];
        return searchTerms.some(
          (term) =>
            term && term.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const generatePDF = () => {
    const columnsToExport = columns.filter((col) => col.field !== "action");

    const prepareDataForReport = (data) => {
      return data.map((booking) => {
        const customerName = `${booking.user.firstName} ${booking.user.lastName}`;
        const roomNumber = booking.room.number;
        const bookingStatus = booking.status;

        const rowData = {};
        columnsToExport.forEach((col) => {
          if (col.field === "user") {
            rowData[col.field] = customerName;
          } else if (col.field === "room") {
            rowData[col.field] = roomNumber;
          } else if (col.field === "checkInDate") {
            rowData[col.field] = formatDate(booking.checkInDate);
          } else if (col.field === "checkOutDate") {
            rowData[col.field] = formatDate(booking.checkOutDate);
          } else if (col.field === "paymentStatus") {
            switch (bookingStatus) {
              case "Pending":
                rowData[col.field] = "Unpaid";
                break;
              case "Confirmed":
                rowData[col.field] = "Paid";
                break;
              case "Cancelled":
                rowData[col.field] = "Need a refund";
                break;
            }
          } else {
            rowData[col.field] = booking[col.field];
          }
        });
        return rowData;
      });
    };

    const reportData = prepareDataForReport(filteredData);
    exportToPDF(columnsToExport, reportData, {
      title: "Room Reservations Report",
    });
  };

  const handleSearchInputChange = (e) => setSearchQuery(e.target.value);

  const handleCancel = async (id) => {
    try {
      const bookdata = { status: "Cancelled" };
      const bookingUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/${id}`,
        bookdata
      );
      if (bookingUpdateResponse.data.success)
        notification.success({
          message: "Booking Cancelled",
          description: "The booking has been successfully cancelled.",
        });
      else throw new Error("Failed to cancel booking");
      fetchBookings();
    } catch (error) {
      notification.error({
        message: "Cancellation Error",
        description:
          error.message ||
          "Failed to cancel the booking due to an unexpected error.",
      });
    }
  };

  const handleCancelConfirmation = (id) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this booking?",
      onOk: () => handleCancel(id._id),
    });
  };

  const handleConfirm = async (id) => {
    try {
      const bookdata = { status: "Confirmed" };
      const bookingUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/${id}`,
        bookdata
      );
      if (bookingUpdateResponse.data.success)
        notification.success({
          message: "Booking Confirmed",
          description: "The booking has been confirmed successfully.",
        });
      else throw new Error("Failed to confirm booking");
      fetchBookings();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.message ||
          "Failed to confirm the booking due to an unexpected error.",
      });
    }
  };

  const handleBookingConfirmation = (id) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to confirm this booking?",
      onOk: () => handleConfirm(id._id),
    });
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
                  Room Reservations
                </Title>
              </Space>
              <Space>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
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
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                onChange={handleSearchInputChange}
                style={{ marginRight: "8px" }}
              />
              <div style={{ flex: 1 }}></div>
            </div>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowClassName={(params) => {
                  if (params.row.status === "Cancelled") return "cancelled-row";
                  return "";
                }}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default BookingsPage;
