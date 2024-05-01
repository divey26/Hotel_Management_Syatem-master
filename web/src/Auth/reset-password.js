import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import backgroundImage from "./logo.png";
const styles = {
  paper: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
  },
  body: {
    
    
    backgroundSize: "70vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // Ensure the background covers the entire viewport height
    margin: 0, // Remove default margin
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundImage: `url(${backgroundImage})`, // Add background image
      backgroundSize: "450px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "8px", // Optional: Add rounded corners to the container
      padding: "16px",  // Optional: Add some padding to the container
  },
  avatar: {
    margin: "4px",
    backgroundColor: "gray",
    width: "100px", // Set the width to 100px
    height: "100px", // Set the height to 100px
  },
  title: {
    fontWeight: "bold",
    fontSize: "50px",
    fontFamily: "Courier, monospace",
    marginBottom: "16px",
  },
  form: {
    width: "100%",
    marginTop: "4px",
  },
  submit: {
    margin: "16px 0 8px",
    transition: "background-color 0.3s ease", // Add transition property for background color
    "&:hover": {
      backgroundColor: "#1976D2", // Change the background color on hover
    },
  },
};
export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic for handling the password reset here
    if (newPassword === confirmPassword) {
      // Passwords match, proceed with the reset
      console.log("Password reset successful");
    } else {
      // Passwords do not match, display an error or handle accordingly
      console.error("Passwords do not match");
    }
  };

  return (
    <div style={styles.body}>
      <Container component="main" maxWidth="xs" style={styles.container}>
        <CssBaseline />
        <div style={styles.paper}>
          <Avatar style={styles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form style={styles.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Reset Password
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
