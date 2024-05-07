import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Space, message, Layout, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import LayoutNew from "../Layout";
import { Link } from "react-router-dom";

const { Search } = Input;

const ComplaintsTablePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/complaints")
      .then((response) => {
        console.log(response.data);
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (id) => {
    // Implement edit functionality here
    // You can navigate to a separate edit page/component with the complaint data
    console.log(`Editing complaint with ID: ${id}`);
  };

  const handleGenerateReport = () => {
    // Create new PDF document
    const doc = new jsPDF();

    // Add content to PDF
    doc.text("Customer Complaints Report", 10, 10);

    // Convert complaints data to array of arrays
    const complaintsData = complaints.map((complaint) => [
      complaint._id,
      complaint.name,
      complaint.email,
      complaint.phone,
      complaint.category,
      complaint.details,
      complaint.attachments,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [
        [
          "ComplaintID",
          "Name",
          "Email",
          "Phone",
          "Category",
          "Details",
          "Attachments",
        ],
      ],
      body: complaintsData,
      startY: 20,
    });

    // Save PDF
    doc.save("complaints_report.pdf");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/complaints/${id}`);
      setComplaints(complaints.filter((complaint) => complaint._id !== id));
      console.log("Complaint deleted successfully!");
      message.success("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      message.error("Failed to delete complaint.");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    // Filter complaints based on the search value
    if (value.trim() === "") {
      // If search value is empty, reset the complaints list
      axios
        .get("http://localhost:8000/api/complaints")
        .then((response) => {
          setComplaints(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      // Otherwise, filter complaints based on the search value
      const filteredComplaints = complaints.filter((complaint) =>
        complaint._id.toLowerCase().includes(value.toLowerCase())
      );
      setComplaints(filteredComplaints);
    }
  };

  const columns = [
    {
      title: "ComplaintID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/updatecomplaint/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

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
        <div>
          <h2>Customer Complaints Summary</h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Search
              placeholder="Search by ID"
              allowClear
              enterButton="Search"
              size="middle"
              onSearch={handleSearch}
              style={{ marginRight: 16 }}
            />
            <div style={{ marginLeft: "auto" }}>
              <Button onClick={handleGenerateReport} type="primary">
                Generate Report
              </Button>
            </div>
          </div>
          <Table dataSource={complaints} columns={columns} />
        </div>
      </Layout>
    </LayoutNew>
  );
};

export default ComplaintsTablePage;
