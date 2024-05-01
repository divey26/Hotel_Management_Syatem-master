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

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "./logo.png";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh", // Ensure the background covers the entire viewport height
      margin: 0, // Remove default margin
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      // Add a semi-transparent white background to the container
      backgroundImage: `url(${backgroundImage})`, // Add background image
      backgroundSize: "450px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "8px", // Optional: Add rounded corners to the container
      padding: "16px",
      // Optional: Add some padding to the container
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
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#1976D2",
      },
    },
  };

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both username and password.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`,
        { username, password }
      );
      console.log(response);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          const authToken = response.data.token;
          const loggedInUser = response.data.data;
          const userId =loggedInUser._id;
          const data=loggedInUser;
          console.log(data);
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("loggedInUserType", loggedInUser.userType);
          localStorage.setItem("userId", userId);
          localStorage.setItem("data", data);
          navigate("/dashboard");
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response.data.message,
      }).then(() => {
        setUsername("");
        setPassword("");
      });
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
          <Typography component="h1" variant="h5" style={styles.title}>
            Sign in
          </Typography>
          <form style={styles.form} noValidate onSubmit={handleSubmit}>
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgotpassword"
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
