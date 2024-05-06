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
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import LayoutNew from "../Layout";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeForm from "./AddEditEmployee";
import axios from "axios";
import { storage } from "../Common/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { exportToPDF } from "../Common/report";
const { Title } = Typography;
const { Content } = Layout;
const token = localStorage.getItem("authToken");

const EmployeeManagementPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] =
    useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [uploadImageEmployee, setUploadImageEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/employees`
      );
      const employeesData = response.data.data.map((employee) => ({
        id: employee._id, // Ensure each row has a unique id
        ...employee,
      }));
      setData(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  useEffect(() => {
    setFilteredData(data); // Initialize filteredData with all employees
  }, [data]);
  const transformedRows = data.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const sortedRows = [...transformedRows].sort((a, b) => a.number - b.number);
  const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "action" && col.field !== "imageUrls" 
      && col.field !=="zipCode" && col.field !=="state" && col.field !=="country"
      && col.field !=="country" && col.field !=="city"
    )
    ;
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
      title: "Employee Report",
    });
  };

  const filterData = () => {
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addNewEmployee = () => {
    setIsAddEmployeeModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddEmployeeModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const handleCancelImageUpload = () => {
    setIsImageModalVisible(false);
    setUploadImageEmployee(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this employee?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteItem(id),
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      message.success("Employee deleted successfully");
      fetchEmployees();
    }
  };

  const handleEdit = (employee) => {
    console.log(employee);
    setEditingEmployee(employee);
    setIsAddEmployeeModalVisible(true);
    form.setFieldsValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      zipCode: employee.zipCode,
      role: employee.role,
    });
  };

  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "city", headerName: "City", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "country", headerName: "Country", width: 100 },
    { field: "zipCode", headerName: "Zip Code", width: 100 },
    { field: "role", headerName: "Role", width: 150 },
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
            onClick={() => confirmDelete(params.row.id)}
            icon={<DeleteOutlined style={{ color: "red" }} />}
          />
        </div>
      ),
    },
  ];

  const onFinish = (values) => {
    onFinishAddEmployee(values);
  };

  const onFinishAddEmployee = async (values) => {
    try {
      console.log(values);
      let response = null;
      if (editingEmployee) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${editingEmployee.id}`,
          values,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/`,
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
        setIsAddEmployeeModalVisible(false);
        const statusText = editingEmployee ? "updated" : "added";
        message.success(`Employee ${statusText} successfully`);
        fetchEmployees();
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
                Employee Management
              </Title>
            </Space>
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

            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewEmployee}
              >
                Add New Employee
              </Button>
            </div>
          </div>
          <DataGrid
            rows={filteredData}
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
            open={isAddEmployeeModalVisible}
            title={editingEmployee ? "Edit Employee" : "Add New Employee"}
            okText={editingEmployee ? "Update" : "Save"}
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
            <EmployeeForm form={form} onFinish={onFinish} />
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default EmployeeManagementPage;
