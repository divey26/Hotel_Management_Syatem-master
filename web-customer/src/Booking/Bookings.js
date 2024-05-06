import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MoneyCollectFilled,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../Common/date";

const Booking = () => {
  const token = localStorage.getItem("customerId");
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate();

  const styles = {
    boldHeader: {
      fontWeight: "bold",
    },
  };
  const columns = [
    { field: "bookingId", headerName: "Booking ID", width: 200 },
    {
      field: "room",
      headerName: "Room",
      width: 200,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
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
      width: 250,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toDateString();
        return formattedDate;
      },
    },
    {
      field: "checkOutDate",
      headerName: "Check-out Date",
      width: 250,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toDateString();
        return formattedDate;
      },
    },
    {
      field: "status",
      headerName: "Booking Status",
      width: 200,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        return params.value;
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
              type="primary"
              onClick={() => handlePayment(params.row)}
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Pay
            </Button>
          )}
          &nbsp;
          {params.row.status !== "Cancelled" && (
            <Button
              type="primary"
              onClick={() => handleCancelConfirmation(params.row)}
              style={{ backgroundColor: "red", borderColor: "red" }}
            >
              Cancel
            </Button>
          )}
        </strong>
      ),
    },
  ];

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/user/${token}`
      );
      setBookingData(response.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to Retrieve Data",
        description: error.message || "Failed to fetch bookings from server",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayment = (booking) => {
    if (
      booking &&
      booking.checkInDate &&
      booking.checkOutDate &&
      booking.room &&
      booking.room.price
    ) {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      const daysDifference = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      ); // Calculate difference in days
      const totalPrice = daysDifference * booking.room.price;

      navigate("/payment", {
        state: {
          price: totalPrice,
          firstName: booking.user.firstName,
          lastName: booking.user.lastName,
          user: booking.user._id,
          bookingid: booking._id,
        },
      });
    } else {
      notification.error({
        message: "Booking Not Found",
        description: "The booking could not be found or is incomplete.",
      });
    }
  };

  const handleCancelConfirmation = (booking) => {
    console.log(booking._id);
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this booking?",
      onOk: () => handleCancel(booking._id),
    });
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

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div>
        <DataGrid
          rows={bookingData}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Booking;
