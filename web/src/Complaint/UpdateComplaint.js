import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import LayoutNew from "../Layout";

const UpdateComplaintPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    category: "",
    details: "",
    attachments: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/complaints/${id}`)
      .then((response) => {
        const complaint = response.data;
        setFormData({
          ...formData,
          _id: complaint._id,
          name: complaint.name,
          email: complaint.email,
          phone: complaint.phone,
          category: complaint.category,
          details: complaint.details,
          attachments: complaint.attachments,
        });
      })
      .catch((error) => {
        console.error("Error fetching complaint data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/complaints/${id}`, formData);
      window.alert("Complaint updated successfully!");
      window.location.href = "/complaint"; // Navigate to complaints page
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  return (
    <LayoutNew>
      <div style={{ padding: 24 }}>
        <Typography variant="h5" gutterBottom>
          Update Complaint
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            variant="outlined"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Details"
            variant="outlined"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Attachments"
            variant="outlined"
            name="attachments"
            value={formData.attachments}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Update Complaint
          </Button>
        </form>
      </div>
    </LayoutNew>
  );
};

export default UpdateComplaintPage;
