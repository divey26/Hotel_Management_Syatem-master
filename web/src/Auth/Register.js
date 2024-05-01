import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link as RouterLink } from "react-router-dom";
import backgroundImage from "./logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
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
      padding: "16px", // Optional: Add some padding to the container
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

  const navigate = useNavigate();
  const userType = "user";
  const [employee, setEmployee] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/register`,
        { employee, username, email, password, userType }
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          const authToken = response.data.token;
          const loggedInUser = response.data.data;
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("loggedInUserType", loggedInUser.userType);
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div style={styles.body}>
      <Container component="main" maxWidth="xs" style={styles.container}>
        <CssBaseline />
        <div style={styles.paper}>
          <Avatar style={styles.avatar}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={styles.title}>
            Register
          </Typography>
          <form style={styles.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="employee"
              label="Employee ID"
              name="employee"
              autoComplete="employee"
              autoFocus
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={styles.submit}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
