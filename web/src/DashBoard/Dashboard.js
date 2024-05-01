// Dashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../Layout";

const Dashboard = () => {
  const [loggedInUserType, setLoggedInUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
  }, []);

  return (
    <Layout userType={loggedInUserType}>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard! This is a sample dashboard component.</p>
      {loggedInUserType && <p>User Type: {loggedInUserType}</p>}
    </Layout>
  );
};

export default Dashboard;
