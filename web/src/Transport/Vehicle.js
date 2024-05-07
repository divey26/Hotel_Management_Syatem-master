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
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import VehicleForm from "./AddEditVehicle";
import axios from "axios";
import { storage } from "../Common/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import "jspdf-autotable";
import { exportToPDF } from "../Common/report";
const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const VehicleManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddVehicleModalVisible, setIsAddVehicleModalVisible] =
    useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [uploadImageVehicle, setUploadImageVehicle] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);


  const filterData = () => {
    const filtered = data.filter((row) => {
      const orderAttributesMatch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      return orderAttributesMatch ;
    });
    setFilteredData(filtered);
  };
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    filterData();
  }, [searchQuery, data]);


  const addNewVehicle = () => {
    setIsAddVehicleModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddVehicleModalVisible(false);
    setEditingVehicle(null);
    form.resetFields();
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this vehicle?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Vehicle deleted successfully");
      fetchVehicles();
    }
  };

  const handleEdit = (vehicle) => {
    console.log(vehicle);
    setEditingVehicle(vehicle);
    setIsAddVehicleModalVisible(true);
    form.setFieldsValue({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      capacity: vehicle.capacity,
      registrationNumber: vehicle.registrationNumber,
    });
  };
  const handleOpenImageUpload = (Vehicle) => {
    setIsImageModalVisible(true);
    setUploadImageVehicle(Vehicle);
  };

  const handleUpload = ({ fileList }) => {
    console.log(fileList);
    const files = fileList.map((file) => file.originFileObj);
    console.log(files);
    setSelectedImages(files);
  };
  const handleCancelImageUpload = () => {
    setIsImageModalVisible(false);
    setUploadImageVehicle(null);
  };
  const handleImageUpload = async () => {
    try {
      let uploadedImageUrls = [];

      // Use map instead of forEach to preserve the order of operations
      await Promise.all(
        selectedImages.map(async (file) => {
          const storageRef = ref(
            storage,
            `Vehicle_images/${uploadImageVehicle.id}/${file.name}`
          );
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(downloadURL);
          console.log("File uploaded successfully. Download URL:", downloadURL);
        })
      );

      let updateVehicleObj = { ...uploadImageVehicle };
      updateVehicleObj.imageUrls = uploadedImageUrls;

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles/${uploadImageVehicle.id}`,
        updateVehicleObj,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        message.success("Images uploaded successfully");
        setSelectedImages([]);
        setIsImageModalVisible(false);
        fetchVehicles();
      }
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
    { field: "make", headerName: "Make", width: 150 },
    { field: "model", headerName: "Model", width: 150 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "capacity", headerName: "Capacity", width: 120 },
    {
      field: "registrationNumber",
      headerName: "Registration Number",
      width: 200,
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
                alt={`Vehicle Image ${index}`}
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
            color="default"
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
    onFinishAddVehicle(values);
  };
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
      title: "Travel Request Report",
    });
  };

  const onFinishAddVehicle = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingVehicle) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles/${editingVehicle.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/vehicles/`,
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
        setIsAddVehicleModalVisible(false);
        const statusText = editingVehicle ? "updated" : "added";
        message.success(`Vehicle ${statusText} successfully`);
        fetchVehicles();
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
                Vehicle Management
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
                onClick={addNewVehicle}
              >
                Add New Vehicle
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
            open={isAddVehicleModalVisible}
            title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            okText={editingVehicle ? "Update" : "Save"}
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
            <VehicleForm form={form} onFinish={onFinish} />
          </Modal>
          <Modal
            open={isImageModalVisible}
            title="Upload Vehicle Images"
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

export default VehicleManagementPage;
