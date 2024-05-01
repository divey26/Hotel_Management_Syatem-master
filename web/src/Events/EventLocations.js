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
  Upload,
} from "antd";
import {
  PlusOutlined,
  StockOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import EventLocationForm from "./AddEditEventLocation";
import axios from "axios";
import { storage } from "../Common/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const EventLocationManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddEventLocationModalVisible, setIsAddEventLocationModalVisible] =
    useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [editingEventLocation, setEditingEventLocation] = useState(null);
  const [uploadImageEventLocation, setUploadImageEventLocation] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchEventLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching Event Locations:", error);
    }
  };

  useEffect(() => {
    fetchEventLocations();
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
    setSearchQuery(e.target.value);
    filterData();
  };

  const addNewEventLocation = () => {
    setIsAddEventLocationModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddEventLocationModalVisible(false);
    setEditingEventLocation(null);
    form.resetFields();
  };

  const handleCancelImageUpload = () => {
    setIsImageModalVisible(false);
    setUploadImageEventLocation(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this Event Location?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Event Location deleted successfully");
      fetchEventLocations();
    }
  };

  const handleEdit = (EventLocation) => {
    console.log(EventLocation);
    setEditingEventLocation(EventLocation);
    setIsAddEventLocationModalVisible(true);
    form.setFieldsValue({
      name: EventLocation.name,
      description: EventLocation.description,
      noOfSeats: EventLocation.noOfSeats,
      availability: EventLocation.availability,
      amenities: EventLocation.amenities,
    });
  };

  const handleOpenImageUpload = (EventLocation) => {
    setIsImageModalVisible(true);
    setUploadImageEventLocation(EventLocation);
  };

  const handleUpload = ({ fileList }) => {
    console.log(fileList);
    const files = fileList.map((file) => file.originFileObj);
    console.log(files);
    setSelectedImages(files);
  };

  const handleImageUpload = async () => {
    try {
      let uploadedImageUrls = [];

      // Use map instead of forEach to preserve the order of operations
      await Promise.all(
        selectedImages.map(async (file) => {
          const storageRef = ref(
            storage,
            `EventLocation_images/${uploadImageEventLocation.id}/${file.name}`
          );
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(downloadURL);
          console.log("File uploaded successfully. Download URL:", downloadURL);
        })
      );

      console.log(uploadedImageUrls);

      let updateEventLocationObj = { ...uploadImageEventLocation };
      updateEventLocationObj.imageUrls = uploadedImageUrls;

      console.log(updateEventLocationObj);

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations/${uploadImageEventLocation.id}`,
        updateEventLocationObj,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        message.success("Images uploaded successfully");
        fetchEventLocations();
      }
      setSelectedImages([]);
      setIsImageModalVisible(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      message.error("Failed to upload images");
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "amenities",
      headerName: "Amenities",
      width: 150,
      renderCell: (params) => {
        const amenities = params.value || [];
        return amenities.length > 0
          ? amenities.map((amenity, index) => <div key={index}>{amenity}</div>)
          : "None";
      },
    },
    { field: "noOfSeats", headerName: "noOfSeats", width: 100 },
    {
      field: "availability",
      headerName: "Availability",
      width: 100,
      renderCell: (params) => {
        return params.value ? "Available" : "Unavailable";
      },
    },
    {
      field: "imageUrls",
      headerName: "Images",
      width: 200,
      renderCell: (params) => {
        const imageUrls = params.value || [];
        return (
          <div
            style={{ display: "flex", gap: "4px", justifyContent: "center" }}
          >
            {imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`EventLocation Image ${index}`}
                style={{ width: "30px", height: "30px" }}
                onClick={() => handlePreview(imageUrl)}
              />
            ))}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleEdit(params.row)}
            icon={<EditOutlined style={{ color: "blue" }} />}
          />
          <Button
            onClick={() => handleOpenImageUpload(params.row)}
            icon={<UploadOutlined style={{ color: "yellow" }} />}
          />
          <Button
            onClick={() => confirmDelete(params.row.id)}
            icon={<DeleteOutlined style={{ color: "red" }} />}
          />
        </div>
      ),
    },
  ];

  const onFinish = (values) => {
    onFinishAddEventLocation(values);
  };

  const onFinishAddEventLocation = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingEventLocation) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations/${editingEventLocation.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/event-locations/`,
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
        setIsAddEventLocationModalVisible(false);
        const statusText = editingEventLocation ? "updated" : "added";
        message.success(`Event Location ${statusText} successfully`);
        fetchEventLocations();
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
                Event Locations Management
              </Title>
            </Space>
            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewEventLocation}
              >
                Add New Event Location
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
          <Modal
            open={isAddEventLocationModalVisible}
            title={
              editingEventLocation
                ? "Edit Event Location"
                : "Add New Event Location"
            }
            okText={editingEventLocation ? "Update" : "Save"}
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
            <EventLocationForm form={form} onFinish={onFinish} />
          </Modal>
          <Modal
            open={isImageModalVisible}
            title="Upload Event Location Images"
            okText="Upload"
            cancelText="Cancel"
            onCancel={handleCancelImageUpload}
            onOk={handleImageUpload}
          >
            <Upload
              multiple
              listType="picture-card"
              accept="image/*"
              beforeUpload={() => false}
              maxCount={4}
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Modal>
          <Modal
            open={previewImage !== null}
            footer={null}
            onCancel={handleClosePreview}
          >
            {previewImage && (
              <img src={previewImage} alt="Preview" style={{ width: "100%" }} />
            )}
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default EventLocationManagementPage;
