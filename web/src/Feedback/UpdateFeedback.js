import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import LayoutNew from "../Layout";

const UpdateFeedbackPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
    cleanlinessRating: "",
    staffFriendlinessRating: "",
    amenitiesRating: "",
    comments: "",
    suggestions: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/feedback/${id}`)
      .then((response) => {
        const feedback = response.data;
        setFormData({
          ...formData,
          _id: feedback._id,
          name: feedback.name,
          email: feedback.email,
          checkInDate: feedback.checkInDate,
          checkOutDate: feedback.checkOutDate,
          cleanlinessRating: feedback.cleanlinessRating,
          staffFriendlinessRating: feedback.staffFriendlinessRating,
          amenitiesRating: feedback.amenitiesRating,
          comments: feedback.comments,
          suggestions: feedback.suggestions,
        });
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/feedback/${id}`, formData);
      window.alert("Feedback updated successfully!");
      window.location.href = "/feedback"; // Navigate to feedback page
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <LayoutNew>
      <div style={{ padding: 24 }}>
        <Typography variant="h5" gutterBottom>
          Update Feedback
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
            label="Check In Date"
            variant="outlined"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Check Out Date"
            variant="outlined"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cleanliness Rating"
            variant="outlined"
            name="cleanlinessRating"
            value={formData.cleanlinessRating}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Staff Friendliness Rating"
            variant="outlined"
            name="staffFriendlinessRating"
            value={formData.staffFriendlinessRating}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amenities Rating"
            variant="outlined"
            name="amenitiesRating"
            value={formData.amenitiesRating}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Comments"
            variant="outlined"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Suggestions"
            variant="outlined"
            name="suggestions"
            value={formData.suggestions}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Update Feedback
          </Button>
        </form>
      </div>
    </LayoutNew>
  );
};

export default UpdateFeedbackPage;
