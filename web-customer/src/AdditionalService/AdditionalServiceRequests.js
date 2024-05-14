import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, notification } from "antd";
import axios from "axios";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../Common/date";

const AdditionalServiceRequests = () => {
  const token = localStorage.getItem("customerId");
  const [data, setAdditionalServiceRequestsData] = useState([]);

  const styles = {
    boldHeader: {
      fontWeight: "bold",
    },
  };
  const columns = [
    { field: "requestId", headerName: "Request ID", width: 200 },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 250,
      headerClassName: styles.boldHeader,
      renderCell: (params) => {
        return formatDate(params.value);
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
              style={{ padding: "0" }}
              size="large"
            >Cancel</Button>
          )}
        </strong>
      ),
    },
  ];

  const fetchAdditionalServiceRequestss = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/user/${token}`
      );
      setAdditionalServiceRequestsData(response.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to Retrieve Data",
        description:
          error.message ||
          "Failed to fetch additional service requests from server",
      });
    }
  };

  useEffect(() => {
    fetchAdditionalServiceRequestss();
  }, []);

  const handleCancelConfirmation = (request) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this request?",
      onOk: () => handleCancel(request._id),
    });
  };

  const handleCancel = async (id) => {
    try {
      const payload = {
        status: "Cancelled",
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/additional-service-requests/${id}`,
        payload
      );

      if (response.data.success) {
        notification.success({
          message: "Request Cancelled",
          description: "Your request has been cancelled successfully",
        });
        fetchAdditionalServiceRequestss();
      } else {
        throw new Error("Failed to cancel request");
      }
    } catch (error) {
      notification.error({
        message: "Cancellation Error",
        description:
          error.message ||
          "Failed to cancel the request due to an unexpected error.",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <DataGrid
          rows={data}
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

export default AdditionalServiceRequests;
