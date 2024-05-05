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

const Orders = () => {
  const token = localStorage.getItem("customerId");
  const [data, setOrdersData] = useState([]);
  const navigate = useNavigate();

  const styles = {
    boldHeader: {
      fontWeight: "bold",
    },
  };
  const columns = [
    { field: "orderId", headerName: "Orders ID", width: 200 },
    {
      field: "items",
      headerName: "Items",
      width: 300,
      renderCell: (params) => (
        <div>
          {params.value.map((item, index) => (
            <div key={index}>
              <span>
                {item.name} ({item.quantity})
              </span>
            </div>
          ))}
        </div>
      ),
    },
    { field: "totalPrice", headerName: "Total Price", width: 150 },
    { field: "deliveryAddress", headerName: "Delivery Address", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "status",
      headerName: "Order Status",
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
          case "Delivered":
            statusColor = "brown";
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/user/${token}`
      );
      setOrdersData(response.data.data);
    } catch (error) {
      notification.error({
        message: "Failed to Retrieve Data",
        description: error.message || "Failed to fetch orders from server",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePayment = (order) => {
    if (order) {
      navigate("/payment", {
        state: {
          price: order.totalPrice,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          user: order.user._id,
          orderId: order._id,
        },
      });
    } else {
      notification.error({
        message: "Order Not Found",
        description: "The order could not be found or is incomplete.",
      });
    }
  };

  const handleCancelConfirmation = (order) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this order?",
      onOk: () => handleCancel(order._id),
    });
  };

  const handleCancel = async (id) => {
    try {
      const bookdata = {
        status: "Cancelled",
      };

      const OrdersUpdateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/${id}`,
        bookdata
      );

      if (OrdersUpdateResponse.data.success) {
        notification.success({
          message: "Order Cancelled",
          description: "The order has been successfully cancelled.",
        });
        fetchOrders();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      notification.error({
        message: "Cancellation Error",
        description:
          error.message ||
          "Failed to cancel the order due to an unexpected error.",
      });
    }
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
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

export default Orders;
