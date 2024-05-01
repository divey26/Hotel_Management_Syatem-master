import React, { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  Layout,
  Typography,
  Button,
  Modal,
  message,
  Space,
  Input,
  notification,
} from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { formatDate } from "../Common/date";

const { Title } = Typography;
const { Content } = Layout;

const BookingsPage = () => {
  const styles = {
    boldHeader: {
      fontWeight: "bold",
    },
  };
  const customHeaderStyle = {
    backgroundColor: "#001529",
  };
  const [data, setData] = useState([]);
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

  useEffect(() => {
    fetchBookings();
  }, []);

  const exportToExcel = () => {
    message.success("Exported to Excel successfully");
  };
  // Export to PDF function
  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    const title = "Bookings";
    const headers = [
      ["Booking ID", "Customer", "Room", "Check-in Date", "Check-out Date", "Number of Guests", "Payment Status", "Booking Status"]
    ];

    const data = transformedRows.map(row => [
      row._id,
      `${row.user.firstName} ${row.user.lastName}`,
      row.room.number,
      formatDate(row.checkInDate),
      formatDate(row.checkOutDate),
      row.numberOfGuests,
      row.paymentStatus,
      row.status
    ]);

    doc.setFontSize(15);
    doc.text(title, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      head: headers,
      body: data
    });

    doc.save("Bookings.pdf");

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

  const handleCancel = async (id) => {
    try {
      const bookdata = {
        status: "Cancelled",
      };

      const bookingUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/${id}`,
        bookdata
      );

      if (bookingUpdateResponse.data.success) {
        notification.success({
          message: "Booking Cancelled",
          description: "The booking has been successfully cancelled.",
        });
      } else {
        throw new Error("Failed to cancel booking");
      }
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
      const bookdata = {
        status: "Confirmed",
      };

      const bookingUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/${id}`,
        bookdata
      );

      if (bookingUpdateResponse.data.success) {
        notification.success({
          message: "Booking Confirmed",
          description: "The booking has been confirmed successfully.",
        });
      } else {
        throw new Error("Failed to confirm booking");
      }
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

  const columns = [
    { field: "_id", headerName: "Booking ID", width: 150 },
    {
      field: "user",
      headerName: "Customer",
      width: 200,
      headerClassName: styles.boldHeader,
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
      field: "room",
      headerName: "Room",
      width: 200,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        if (!params.value) {
          return 'N/A';
        }
    
        const roomNumber = params.value.number || 'N/A';
        const roomPrice = params.value.price || 'N/A';
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
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "checkOutDate",
      headerName: "Check-out Date",
      width: 150,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        return formatDate(params.value);
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
            paymentStatus = "unpaid";
            statusColor = "orange";
            break;
          case "Confirmed":
            paymentStatus = "paid";
            statusColor = "green";
            break;
          case "Cancelled":
            paymentStatus = "refund";
            statusColor = "red";
            break;
          default:
            paymentStatus = "Unknown";
            statusColor = "black";
        }
        return <span style={{ color: statusColor }}>{paymentStatus}</span>;
      },
    },
    {
      field: "status",
      headerName: "Booking Status",
      width: 200,
      headerClassName: styles.boldHeader,
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
      headerClassName: styles.boldHeader,
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
                  Room Reservations
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
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowClassName={(params) => {
                  if (params.row.status === "Cancelled") {
                    return "cancelled-row";
                  }
                  return "";
                }}
                headerClassName={customHeaderStyle}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default BookingsPage;
