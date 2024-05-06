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
  FilePdfOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  LoadScript,
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import TravelRequestForm from "./AddEditTravelRequest";
import axios from "axios";
import moment from "moment";
import { formatDate } from "../Common/date";
import "jspdf-autotable";
import { exportToPDF } from "../Common/report";
import AssignDriverVehicleForm from "./AssignDriverAndVehicle";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const TravelRequestsManagementPage = () => {
  const [form] = Form.useForm();
  const [driverAssignForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [selectedItemForAssignDriver, setSelectedItemForAssignDriver] =
    useState(null);
  const [isOpenAssignDriverModal, setIsOpenAssignDriverModal] = useState(false);
  const [isAddTravelRequestsModalVisible, setIsAddTravelRequestsModalVisible] =
    useState(false);
  const [editingTravelRequests, setEditingTravelRequests] = useState(null);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [directions, setDirections] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [directionsFetched, setDirectionsFetched] = useState(false);
  const libraries = ["places"];
  const [mapLoaded, setMapLoaded] = useState(false);
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

  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);
  const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "action" && col.field !== "imageUrls"
    );
    const prepareDataForReport = (data) => {
      return data.map((menu) => {
        const rowData = {};
        columnsToExport.forEach((col) => {
          rowData[col.field] = menu[col.field];
        });
        return rowData;
      });
    };

    const reportData = prepareDataForReport(filteredData);
    exportToPDF(columnsToExport, reportData, {
      title: "Vehicle Report",
    });
  };

  const filterData = () => {
    const filtered = data.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      return orderAttributesMatch;
    });
    setFilteredData(filtered);
  };
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    filterData();
  }, [searchQuery, data]);

  const addNewTravelRequests = () => {
    setIsAddTravelRequestsModalVisible(true);
  };

  const handleCancelDriverAssign = () => {
    setIsOpenAssignDriverModal(false);
    setSelectedItemForAssignDriver(null);
    driverAssignForm.resetFields();
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

  const handleAssignDriver = (data) => {
    setSelectedItemForAssignDriver(data);
    setIsOpenAssignDriverModal(true);
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
  const fetchDirections = (order) => {
    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: order.startupLocation,
          destination: order.endupLocation,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    } else {
      console.error("Google Maps API not available.");
    }
  };
  

  const trackOrder = (order) => {
    setSelectedOrder(order);
    setTrackModalVisible(true);

    // Fetch directions every time a new order is selected
    fetchDirections(order);
  };
  const columns = [
    { field: "requestId", headerName: "Request ID", width: 200 },
    {
      field: "user",
      headerName: "Customer",
      width: 200,
      renderCell: (params) => {
        const customer = params.value;
        const ID = customer?.customerId;
        const Name = customer?.firstName + " " + customer?.lastName;
        return (
          <div style={{ height: "100%", lineHeight: "normal" }}>
            <p style={{ margin: 0, lineHeight: "1.5" }}>ID: {ID}</p>
            <p style={{ margin: 0, lineHeight: "1.5" }}>Name: {Name}</p>
          </div>
        );
      },
      
    },
    {
      field: "driver",
      headerName: "Driver",
      width: 200,
      renderCell: (params) => {
        const driver = params.value;
        if (!driver) {
          return "None";
        }
        const Name = driver.driverId + " " + driver.firstName;
        return Name;
      },
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      width: 200,
      renderCell: (params) => {
        const vehicle = params.value;
        if (!vehicle) {
          return "None";
        }
        const Name = vehicle.vehicleId + " " + vehicle?.registrationNumber;
        return Name;
      },
    },

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
    { field: "requests", headerName: "Additional Requests", width: 150 },
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
                onClick={() => handleAssignDriver(params.row)}
                icon={<UserAddOutlined style={{ color: "yellow" }} />}
              />
              <Button
                onClick={() => trackOrder(params.row)}
                icon={<EnvironmentOutlined style={{ color: "green" }} />}
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

  const assignDriver = async (values) => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests/${selectedItemForAssignDriver.id}`;
      await axios.put(apiUrl, {
        ...values,
      });
      message.success("Driver assigned successfully");
      driverAssignForm.resetFields();
      setSelectedItemForAssignDriver(null);
      setIsOpenAssignDriverModal(false);
      fetchTravelRequestss();
    } catch (error) {
      console.error("Error assign driver", error);
      message.error("Failed to assign driver.");
    }
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
              {/* Export buttons */}
              <Space>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={generatePDF}
                >
                  Export to PDF
                </Button>
              </Space>
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
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewTravelRequests}
              >
                Add New Travel Request
              </Button>
            </div>
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
          <Modal
            open={isOpenAssignDriverModal}
            title="Assign Driver"
            okText="Assign"
            cancelText="Cancel"
            onCancel={handleCancelDriverAssign}
            onOk={() => {
              driverAssignForm
                .validateFields()
                .then((values) => {
                  assignDriver(values);
                })
                .catch((errorInfo) => {
                  console.log("Validation Failed:", errorInfo);
                });
            }}
          >
            <AssignDriverVehicleForm
              form={driverAssignForm}
              onFinish={assignDriver}
            />
          </Modal>

          <Modal
            visible={trackModalVisible}
            onCancel={() => setTrackModalVisible(false)}
            footer={null}
            title={
              <div>
                <p>
                  <span style={{ color: "blue" }}>From:</span>{" "}
                  {selectedOrder ? selectedOrder.startupLocation : ""}
                </p>
                <p>
                  <span style={{ color: "blue" }}>To:</span>{" "}
                  {selectedOrder ? selectedOrder.endupLocation : ""}
                </p>
                <p>
                  Track Your Order{" "}
                  <span style={{ color: "red" }}>
                    {selectedOrder
                      ? `- Tracking ID: ${selectedOrder.requestId}`
                      : ""}
                  </span>{" "}
                  {directions &&
                    directions.routes &&
                    directions.routes.length > 0 &&
                    `- Distance: ${directions.routes[0].legs[0].distance.text}, Duration: ${directions.routes[0].legs[0].duration.text}`}
                </p>
              </div>
            }
            width={800}
          >
            {selectedOrder && ( // Render the Google Maps components only if selectedOrder and mapLoaded are true
              <div style={{ height: "400px" }}>
                <LoadScript
                  googleMapsApiKey="AIzaSyD4IT9MWL9Sz5gm6zTrVJudjYuhbvOC4M0"
                  libraries={libraries}
                >
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={{
                      lat: selectedOrder.startupLocation.lat,
                      lng: selectedOrder.startupLocation.lng,
                    }} // Set a default center for the map
                    zoom={10}
                  >
                    {directions && (
                      <DirectionsRenderer directions={directions} />
                    )}
                    <Marker
                      position={{
                        lat: selectedOrder.startupLocation.lat,
                        lng: selectedOrder.startupLocation.lng,
                      }}
                    />
                    <Marker
                      position={{
                        lat: selectedOrder.endupLocation.lat,
                        lng: selectedOrder.endupLocation.lng,
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default TravelRequestsManagementPage;
