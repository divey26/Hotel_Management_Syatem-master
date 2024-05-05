import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, notification } from "antd";
import axios from "axios";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "../Common/date";

const TravelRequests = () => {
  const token = localStorage.getItem("customerId");
  const [data, setTravelRequestsData] = useState([]);

  const columns = [
    { field: "requestId", headerName: "Request ID", width: 150 },
    { field: "startupLocation", headerName: "Pickup", width: 200 },
    { field: "endupLocation", headerName: "Destination", width: 200 },
    {
      field: "travelStartDateTime",
      headerName: "Start At",
      width: 180,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "travelEndDateTime",
      headerName: "End At",
      width: 180,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    { field: "passengers", headerName: "No Of Passengers", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <strong>
          {params.row.status === "Confirmed" && (
            <Button
              type="link"
              icon={
                <CloseCircleOutlined
                  style={{ color: "red", fontSize: "20px" }}
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

  const fetchTravelRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/user/${token}`
      );

      const filteredData = response.data.data.filter(
        (request) => request.travelType !== "food-delivery"
      );

      setTravelRequestsData(filteredData);
    } catch (error) {
      notification.error({
        message: "Failed to Retrieve Data",
        description:
          error.message || "Failed to fetch travel requests from server",
      });
    }
  };

  useEffect(() => {
    fetchTravelRequests();
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${id}`,
        payload
      );

      if (response.data.success) {
        notification.success({
          message: "Request Cancelled",
          description: "Your request has been cancelled successfully",
        });
        fetchTravelRequests();
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
    <div style={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default TravelRequests;
