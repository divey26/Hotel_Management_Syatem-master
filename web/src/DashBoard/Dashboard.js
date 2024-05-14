import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Row, Col } from "antd";
import {
  UserAddOutlined,
  AppstoreAddOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import CardView from "./CardView";
import "./Dashboard.css";
import ApexChart from "react-apexcharts";
import axios from "axios"; // Import axios
import { Link } from "react-router-dom";
import moment from "moment";
const Dashboard = () => {
  const [loggedInUserType, setLoggedInUserType] = useState("");
  const [employeesCount, setEmployeesCount] = useState(0); // State to store the count of employees
  const [eventsCount, setEventCount] = useState(0); // State to store the count of employees
  const [menusCount, setMenuCount] = useState(0); // State to store the count of employees
  const [travelsCount, setTravelCount] = useState(0); // State to store the count of employees
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [recordCount, setRecordCount] = useState([]);
  const [leaveCount, setLeaveCount] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const userType = localStorage.getItem("loggedInUserType");
    if (userType) {
      setLoggedInUserType(userType);
    }
    fetchEmployees();
    fetchEvents();
    fetchMenus();
    fetchTravelRequestss();
    fetchOrders();
    fetchData();
    fetchRecords1();
    fetchData1Leave();
    fetchDataLeave();
    fetchRecords();

  }, []);
  const fetchData1Leave = async () => {
    let apiUrl;
    const token = localStorage.getItem("userId");
    const employeeids = localStorage.getItem("empid");
    apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/user/${employeeids}`; // Fetch leave requests for specific user
    console.log(apiUrl);
    try {
      const response = await axios.get(apiUrl);
      setData(
        response.data.data.map((item, index) => ({
          key: index.toString(),
          ...item,
          startDate: moment(item.startDate).format("YYYY-MM-DD"),
          endDate: moment(item.endDate).format("YYYY-MM-DD"),
        }))
      );
    
      setLeaveCount(response.data.data.length);
    } catch (error) {
      console.error(`Failed to fetch data: ${error.message}`);
    }
  };
  const fetchRecords1 = async () => {
    try {
      const token = localStorage.getItem("userId");
      const employeeids = localStorage.getItem("empid");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/user/${employeeids}`
      );
      setData(response.data.data);
      console.log(response)
      setRecordCount(response.data.data.length);
    } catch (error) {
      console.error("Failed to fetch records: " + error.message);
    }
  };
  const fetchDataLeave = async () => {
    try {
      const token = localStorage.getItem("userId");
      const employeeids = localStorage.getItem("empid");
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/leave-request/user/${employeeids}`;
      const response = await axios.get(apiUrl);
      const formattedData = response.data.data.map((item, index) => ({
        x: new Date(moment(item.startDate).format("YYYY-MM-DD")),
        y: index + 1,
        marker: {
          size: 8,
          fillColor: '#FF4560',
          strokeColor: '#FF4560',
          hover: {
            size: 10
          }
        }
      }));
      setLeaveData(formattedData);
    } catch (error) {
      console.error(`Failed to fetch leave data: ${error.message}`);
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("userId");
      const employeeids = localStorage.getItem("empid");
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/user/${employeeids}`;
      const response = await axios.get(apiUrl);
      const formattedData = response.data.data.map(item => ({
        x: new Date(moment(item.date).format("YYYY-MM-DD")),
        y: 0,
        marker: {
          size: 8,
          fillColor: '#008FFB',
          strokeColor: '#008FFB',
          hover: {
            size: 10
          }
        }
      }));
      setAttendanceData(formattedData);
    } catch (error) {
      console.error(`Failed to fetch attendance data: ${error.message}`);
    }
  };

  const series = [{
    name: 'Attendance',
    data: attendanceData
  }, {
    name: 'Leaves',
    data: leaveData
  }];

  const options = {
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      }
    },
    title: {
      text: 'Leave & Attendance',
      align: 'center',
      style: {
        fontSize: '20px',
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd'
        }
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    markers: {
      size: 6
    },
    legend: {
      position: 'top'
    }
  };


  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/menus`
      );
      setData(response.data.data);
      setMenuCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/employees`
      );
      const employeesData = response.data.data.map((employee) => ({
        id: employee._id, // Ensure each row has a unique id
        ...employee,
      }));
      setData(employeesData);
      setEmployeesCount(employeesData.length); // Set the count of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/events`
      );
      const eventsData = response.data.data.map((event) => ({
        id: event._id, // Ensure each row has a unique id
        ...event,
      }));
      setData(response.data.data);
      setEventCount(eventsData.length);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const fetchTravelRequestss = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/travel-requests`
      );
      setData(response.data.data);
      setTravelCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching Travel Requests:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/orders`);
      const orders = response.data.data;
      setOrderItemsData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Group items by name and sum their quantities
const groupedData = orderItemsData.reduce((accumulator, order) => {
  order.items.forEach((item) => {
    const itemName = item.name;
    if (accumulator[itemName]) {
      accumulator[itemName] += item.quantity;
    } else {
      accumulator[itemName] = item.quantity;
    }
  });
  return accumulator;
}, {});

// Convert the grouped data into chart data format
const chartData = Object.keys(groupedData).map((itemName) => ({
  name: itemName,
  y: groupedData[itemName],
}));

const bubleoptions = {
  chart: {
    height: 350,
    type: 'donut', // Change chart type to donut
  },
  
  dataLabels: {
    enabled: true
  },
  title: {
    text: 'Orders Over Time', // Set the title of the chart
    align: 'center',
    style: {
      fontSize: '20px',
    },
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
          },
          value: {
            show: true,
          },
          total: {
            show: true,
            label: 'Total Orders',
          },
          formatter: function(val, opts) {
            return opts.w.globals.labels[opts.seriesIndex] + ":  " + val
          }
        },
      },
    },
  },
  fill: {
    type: 'gradient', // Use gradient fill
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
};

// Now you can use chartData and donutOptions to render your chart


  const barChartData = Object.keys(orderItemsData).map((item) => {

    return {
      y: item,
      x: orderItemsData[item],
    };
  });
  
  const barChartOptions = {
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      title: {
        text: "Quantity",
      },
    },
    yaxis: {
      title: {
        text: "Item Name",
      },
    },
    title: {
      text: "Order Items",
      align: "center",
      floating: true,
    },
  };

  const fetchData = async () => {
    try {
      const orderResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/orders`
      );
      setOrderData(orderResponse.data.data);

      const paymentResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/payments`
      );
      setPaymentData(paymentResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Extracting data for orders series
  const orderSeriesData = orderData.map((order) => ({
    x: new Date(order.createdAt).getTime(),
    y: order.totalPrice, // You can customize the value as per your requirement
  }));

  // Extracting data for payments series
  const paymentSeriesData = paymentData.map((payment) => ({
    x: new Date(payment.paidOn).getTime(),
    y: payment.totalPrice, // You can customize the value as per your requirement
  }));

  const splineChartOptions = {
    chart: {
      type: "area",
      height: 350,
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: function (val) {
          return new Date(val).toLocaleDateString(); // Format date
        },
      },
    },
    yaxis: {
      title: {
        text: "Amount gain by Orders/Booking",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    legend: {
      position: "top",
    },
  };
  return (
    <Layout userType={loggedInUserType}>
      {loggedInUserType === "admin" ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/employee">
                <CardView
                  title="Create Employee"
                  description={`Total Employees: ${employeesCount}`}
                  icon={<UserAddOutlined />}
                />
              </Link>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/events">
                <CardView
                  title="Events"
                  description={`Total Events: ${eventsCount}`}
                  icon={<CalendarOutlined />}
                />
              </Link>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/menus">
                <CardView
                  title="Menu"
                  description={`Total Menu: ${menusCount}`}
                  icon={<AppstoreAddOutlined />}
                />
              </Link>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/transports">
                <CardView
                  title="Transport"
                  description={`Total Menu: ${travelsCount}`}
                  icon={<CarOutlined />}
                />
              </Link>
            </Col>
          </Row>
          <br />
          <br />
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12}>
            <ApexChart options={bubleoptions} series={chartData.map(dataPoint => dataPoint.y)} type="donut" height={350} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ApexChart
                series={[
                  { name: "Orders", data: orderSeriesData },
                  { name: "Bookings", data: paymentSeriesData },
                ]}
                options={splineChartOptions}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/attendance">
                <CardView
                  title="Attendance"
                  description={`Total Attendance : ${recordCount}`}
                  icon={<UserAddOutlined />}
                />
              </Link>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Link to="/leaveTracking">
                <CardView
                  title="Leaves"
                  description={`Total Leaves: ${leaveCount}`}
                  icon={<CalendarOutlined />}
                />
              </Link>
            </Col>
          </Row>
          <br />
          <br />
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <ApexChart
               options={options}
               series={series}
               type="scatter"
               height={350}
              />
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
