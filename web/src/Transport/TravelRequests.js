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
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import TravelRequestForm from "./AddEditTravelRequest";
import axios from "axios";
import moment from "moment";
import { formatDate } from "../Common/date";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const TravelRequestsManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddTravelRequestsModalVisible, setIsAddTravelRequestsModalVisible] =
    useState(false);
  const [editingTravelRequests, setEditingTravelRequests] = useState(null);

  const fetchTravelRequestss = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching Travel Requests:", error);
    }
  };

  useEffect(() => {
    fetchTravelRequestss();
  }, []);

  const transformedRows = data.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);

  const filterData = () => {
    setFilteredData(data);
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    filterData();
  };

  const addNewTravelRequests = () => {
    setIsAddTravelRequestsModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddTravelRequestsModalVisible(false);
    setEditingTravelRequests(null);
    form.resetFields();
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
      `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Travel Request deleted successfully");
      fetchTravelRequestss();
    }
  };

  const handleEdit = (travelRequest) => {
    console.log(travelRequest);
    setEditingTravelRequests(travelRequest);
    setIsAddTravelRequestsModalVisible(true);
    form.setFieldsValue({
      passengers: travelRequest.passengers,
      travelType: travelRequest.travelType,
      startupLocation: travelRequest.startupLocation,
      endupLocation: travelRequest.endupLocation,
      travelStartDateTime: moment(travelRequest.travelStartDateTime),
      travelEndDateTime: moment(travelRequest.travelEndDateTime),
      status: travelRequest.status,
    });
  };

  const handleAssignDriver = () => {};
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
      `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${id}`,
      payload
    );
    if (response.data.success) {
      message.success("Request confirmed successfully");
      fetchTravelRequestss();
    }
  };

  const handleCancelRequest = (id) => {
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
      `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${id}`,
      payload,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Request cancelled successfully");
      fetchTravelRequestss();
    }
  };
  const columns = [
    { field: "travelType", headerName: "Request Type", width: 200 },
    { field: "startupLocation", headerName: "Startup Location", width: 250 },
    { field: "endupLocation", headerName: "Endup Location", width: 250 },
    {
      field: "travelStartDateTime",
      headerName: "Travel Start Date Time",
      width: 250,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "travelEndDateTime",
      headerName: "Travel End Date Time",
      width: 250,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    { field: "passengers", headerName: "No Of Passengers", width: 150 },
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
          <Tooltip title="Edit request">
            <Button
              onClick={() => handleEdit(params.row)}
              icon={<EditOutlined style={{ color: "blue" }} />}
            />
          </Tooltip>
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
                  onClick={() => handleCancelRequest(params.row.id)}
                />
              </Tooltip>
            </>
          )}
          {params.row.status === "Confirmed" && (
            <Tooltip title="Assign driver & vehicle">
              <Button
                onClick={() => handleAssignDriver(params.row.id)}
                icon={<UserAddOutlined style={{ color: "yellow" }} />}
              />
            </Tooltip>
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

  const onFinish = (values) => {
    onFinishAddTravelRequests(values);
  };

  const onFinishAddTravelRequests = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingTravelRequests) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${editingTravelRequests.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/`,
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
        setIsAddTravelRequestsModalVisible(false);
        const statusText = editingTravelRequests ? "updated" : "added";
        message.success(`Travel Request ${statusText} successfully`);
        fetchTravelRequestss();
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

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
                Travel Requests Management
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewTravelRequests}
              >
                Add New Travel Request
              </Button>
            </div>
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
            open={isAddTravelRequestsModalVisible}
            title={
              editingTravelRequests
                ? "Edit Travel Request"
                : "Add New Travel Request"
            }
            okText={editingTravelRequests ? "Update" : "Save"}
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
            <TravelRequestForm form={form} onFinish={onFinish} />
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default TravelRequestsManagementPage;
