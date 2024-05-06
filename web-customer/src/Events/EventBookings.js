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

const EventBookings = () => {
  const token = localStorage.getItem("customerId");
  const [EventBookingsData, setEventBookingsData] = useState([]);
  const navigate = useNavigate();

  const styles = {
    boldHeader: {
      fontWeight: "bold",
    },
  };
  const columns = [
    { field: "requestId", headerName: "Booking ID", width: 200 },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 250,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        // Assuming params.value is a valid Date object
        const date = new Date(params.value);
        const formattedDate = date.toDateString();
        return formattedDate;
      },
    },

    {
      field: "location",
      headerName: "Location",
      width: 250,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        return params.value.name;
      },
    },
    {
      field: "status",
      headerName: "Status",
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
          {params.row.status === "Confirmed" && (
            <Button
              type="link"
              onClick={() => handleCancelConfirmation(params.row)}
              style={{ padding: "0", color: "red" }} // Added color: "red"
              size="large"
            >
              {" "}
              Cancel
            </Button>
          )}
        </strong>
      ),
    },
  ];

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/event-requests/user/${token}`
      );
      setEventBookingsData(response.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to Retrieve Data",
        description:
          error.message || "Failed to fetch Event Bookings from server",
      });
    }
  };

  useEffect(() => {
    fetchEventBookings();
  }, []);

  const handleCancelConfirmation = (booking) => {
    console.log(booking._id);
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this event booking?",
      onOk: () => handleCancel(booking._id),
    });
  };

  const handleCancel = async (id) => {
    try {
      const bookdata = {
        status: "Cancelled",
      };

      const EventBookingsUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/event-requests/${id}`,
        bookdata
      );

      if (EventBookingsUpdateResponse.data.success) {
        notification.success({
          message: "Event booking Cancelled",
          description: "The event booking has been successfully cancelled.",
        });
      } else {
        throw new Error("Failed to cancel event booking");
      }
      fetchEventBookings();
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
          rows={EventBookingsData}
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

export default EventBookings;
