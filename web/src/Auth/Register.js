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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link as RouterLink } from "react-router-dom";
import backgroundImage from "./logo.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

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
  const [signUpAsAdmin, setSignUpAsAdmin] = useState(false); // State variable for admin signup
  const [employee, setEmployee] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!signUpAsAdmin && !employee) {
      message.error("Please give the employee id!");
      return
    }
    if (!username || !email || !password) {
      message.error("Please give the details!");
      return
    }
    handleRegister()
  };

  const handleRegister = async () => {
    try {
      const userType = signUpAsAdmin ? "admin" : "user"; // Determine user type
      const userData = signUpAsAdmin
        ? { username, email, password, userType }
        : { employee, username, email, password, userType };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/register`,
        userData
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          const authToken = response.data.token;
          const createdUser = response.data.data.createdUser;
          console.log(createdUser);
          const userId = createdUser._id;
          const empid = createdUser.employee;
          const data = createdUser;
          console.log(data);
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("loggedInUserType", createdUser.userType);
          localStorage.setItem("userId", userId);
          localStorage.setItem("data", data);
          localStorage.setItem("empid", empid);
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes("E11000 duplicate key error")
      ) {
        // Duplicate key error
        message.error("User already exists");
      } else {
        // Other errors
        message.error(error.response.data.message);
      }
    }
  }

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
            {!signUpAsAdmin && ( // Conditionally render employee ID field
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
            )}
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
              type="email"
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={signUpAsAdmin}
                  onChange={(e) => setSignUpAsAdmin(e.target.checked)}
                  color="primary"
                />
              }
              label="Sign up as admin"
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
