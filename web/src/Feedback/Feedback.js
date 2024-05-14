import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Space, message, Layout, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import { Feedback } from "@mui/icons-material";
import LayoutNew from "../Layout";


const { Search } = Input;

const FeedbackTablePage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/feedback")
      .then((response) => {
        console.log(response.data);
        setFeedbacks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (id) => {
    // Implement edit functionality here
    // You can navigate to a separate edit page/component with the feedback data
    console.log(`Editing feedback with ID: ${id}`);
  };

  const handleGenerateReport = () => {
    // Create new PDF document
    const doc = new jsPDF();

    // Add content to PDF
    doc.text(" Customer Feedback Report", 10, 10);

    // Convert feedbacks data to array of arrays
    const feedbacksData = feedbacks.map((feedback) => [
      feedback._id,
      feedback.name,
      feedback.email,
      feedback.checkInDate,
      feedback.checkOutDate,
      feedback.cleanlinessRating,
      feedback.staffFriendlinessRating,
      feedback.amenitiesRating,
      feedback.comments,
      feedback.suggestions,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [
        [
          "FeedbackID",
          "Name",
          "Email",
          "CheckIn",
          "CheckOut",
          "Cleanliness",
          "Staff",
          "Amenties",
          "Comments",
          "Suggestions",
        ],
      ],
      body: feedbacksData,
      startY: 20,
    });

    // Save PDF
    doc.save("feedback_report.pdf");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id)); // Update state to remove the deleted feedback
      console.log("Feedback deleted successfully!");
      window.alert("Feedback deleted successfully!"); // Display alert message
    } catch (error) {
      console.error("Error deleting feedback:", error);
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
          setFeedbacks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      // Otherwise, filter complaints based on the search value
      const filteredFeedbacks = feedbacks.filter((feedback) =>
        feedback._id.toLowerCase().includes(value.toLowerCase())
      );
      setFeedbacks(filteredFeedbacks);
    }
  };

  const [loggedInUserType, setLoggedInUserType] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  const columns = [
    {
      title: "FeedbackID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Check In",
      dataIndex: "checkInDate",
      key: "checkInDate",
    },
    {
      title: "Check Out",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
    },
    {
      title: "Cleanliness",
      dataIndex: "cleanlinessRating",
      key: "cleanlinessRating",
    },
    {
      title: "Staff",
      dataIndex: "staffFriendlinessRating",
      key: "staffFriendlinessRating",
    },
    {
      title: "Amenities",
      dataIndex: "amenitiesRating",
      key: "amenitiesRating",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Suggestions",
      dataIndex: "suggestions",
      key: "suggestions",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/updatefeedback/${record._id}`}>
            
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



  return (
    <LayoutNew userType={loggedInUserType}>
      <Layout>
        <div>
          <h2>Customer Feedback Summary</h2>
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
          <Table dataSource={feedbacks} columns={columns} />
        </div>
      </Layout>
    </LayoutNew>
  );
};

export default FeedbackTablePage;
