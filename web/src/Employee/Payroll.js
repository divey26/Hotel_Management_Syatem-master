import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Space,
  Modal,
  message,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  DollarCircleOutlined,
  SearchOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import "jspdf-autotable";
import moment from 'moment';
import { exportToPDF } from "../Common/report";
import LayoutNew from "../Layout";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const PayrollPage = () => {
  const [loggedInUserType, setLoggedInUserType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [netSalary, setNetSalary] = useState(0);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // For Edit
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [searchQuery, setSearchQuery] = useState(""); // For Edit
  const transformedRows = filteredData.map((row, index) => ({
    id: row._id, // or any other property that can uniquely identify the row
    ...row,
  }));

  const generatePDF = () => {
    const columnsToExport = columns.filter(
      (col) => col.field !== "actions" && col.field !== "imageUrls"
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
      title: "Payroll Report",
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

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/employees`
      );
      const employeesData = response.data.data.map((employee) => ({
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
      }));
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchPayrolls = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/payroll`
      );
      const payrollData = await Promise.all(
        response.data.data.map(async (payroll) => {
          const employeeResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/employees/${payroll.employeeId}`
          );
          const employee = employeeResponse.data.data;
          return {
            ...payroll,
            name: `${employee.firstName} ${employee.lastName}`,
            monthyear: new Date(payroll.monthYear).toLocaleDateString(), // Convert date to a readable format
          };
        })
      );
      console.log("payroll data", payrollData);
      setData(payrollData);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log(values);
    const basicSalary = parseFloat(values.basicSalary);
    const performanceAllowance = parseFloat(values.performanceAllowance);
    const totalSalary = basicSalary + performanceAllowance;
    setNetSalary(totalSalary);

    try {
      let response = null;
      if (selectedRow) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/payroll/${selectedRow.id}`,
          values
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/payroll/`,
          values
        );
      }

      if (response.data.success) {
        form.resetFields();
        setNetSalary(null);
        setIsModalVisible(false);
        const statusText = selectedRow ? "updated" : "added";
        message.success(`Payroll ${statusText} successfully`);
        fetchPayrolls();
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleBasicSalaryChange = (e) => {
    const basicSalary = parseFloat(e.target.value);
    const performanceAllowance = parseFloat(
      form.getFieldValue("performanceAllowance")
    );
    const totalSalary = basicSalary + performanceAllowance;
    setNetSalary(totalSalary);
  };

  const handlePerformanceAllowanceChange = (e) => {
    const performanceAllowance = parseFloat(e.target.value);
    const basicSalary = parseFloat(form.getFieldValue("basicSalary"));
    const totalSalary = basicSalary + performanceAllowance;
    setNetSalary(totalSalary);
  };

  // Define columns for DataGrid
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "basicSalary", headerName: "Basic Salary", width: 150 },
    {
      field: "performanceAllowance",
      headerName: "Performance Allowance",
      width: 200,
    },
    { field: "monthyear", headerName: "Month & Year", width: 200 },
    // Edit and Delete Actions
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row)}>Delete</Button>
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    setSelectedRow(row);
    form.setFieldsValue({
      employeeId: row.employeeId,
      basicSalary: row.basicSalary,
      performanceAllowance: row.performanceAllowance,
      monthYear: moment(row.monthYear), // assuming you're using Moment.js for date handling
    });
    setIsModalVisible(true); // Open modal for editing
  };

  const handleDelete = async (row) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this payroll entry?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/payroll/${row._id}`);
          if (response.data.success) {
            message.success("Payroll deleted successfully");
            fetchPayrolls(); // Refresh the payroll list after deletion
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          message.error("An error occurred while deleting the payroll");
        }
      },
      onCancel: () => {
        console.log('Deletion canceled');
      },
    });
  };
  
  

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
              <DollarCircleOutlined
                style={{ fontSize: "24px", marginRight: "8px" }}
              />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "white" }}
              >
                Payroll & Benefits Administration
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

            {/* Empty space to push buttons to the right */}
            <div style={{ flex: 1 }}></div>

            <div style={{ marginLeft: "auto", marginRight: "20px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Add New Payroll
              </Button>
            </div>
          </div>
          {/* DataGrid Component */}
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={transformedRows}
              columns={columns}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
            />
          </div>
          {/* Add New Payroll Modal */}
          <br />
          <Modal
            title={selectedRow ? "Update Payroll" : "Add New Payroll"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="employeeId"
                label="Select Employee"
                rules={[
                  { required: true, message: "Please select an employee!" },
                ]}
              >
                <Select placeholder="Select employee">
                  {employees.map((employee) => (
                    <Option key={employee.id} value={employee.id}>
                      {employee.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="basicSalary"
                label="Basic Salary"
                rules={[
                  { required: true, message: "Please input basic salary!" },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter basic salary"
                  onChange={handleBasicSalaryChange}
                />
              </Form.Item>
              <Form.Item
                name="performanceAllowance"
                label="Performance Allowance"
                rules={[
                  {
                    required: true,
                    message: "Please input performance allowance!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter performance allowance"
                  onChange={handlePerformanceAllowanceChange}
                />
              </Form.Item>
              {/* New Form.Item for selecting month & year */}
              <Form.Item
                name="monthYear"
                label="Select Month & Year"
                rules={[
                  { required: true, message: "Please select month & year!" },
                ]}
              >
                <DatePicker picker="month" format="MMMM YYYY" />
              </Form.Item>
              <Form.Item label="Net Salary">
                <Input value={netSalary} readOnly />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {selectedRow ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </LayoutNew>
  );
};

export default PayrollPage;
