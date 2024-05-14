import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown } from "antd";
import {
  UserSwitchOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import {
  HomeOutlined,
  MenuOutlined,
  CalendarOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const StyledFooter = styled.footer`
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
  bottom: 0;
  width: 100%;
`;

const SocialIcons = styled.div`
  margin-bottom: 20px;
`;

const ContactInfo = styled.div`
  margin-bottom: 10px;
`;

const Template = ({ children }) => {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const headerItems = [
    {
      key: "1",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      label: "Foods",
      icon: <MenuOutlined />,
      onClick: () => navigate("/foods"),
    },
    {
      key: "3",
      label: "Events",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/events"),
    },
    {
      key: "4",
      label: "Travels",
      icon: <CarOutlined />,
      onClick: () => navigate("/vehicles"),
    },
    {
      key: "5",
      label: "Additional Services",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/additional-services"),
    },
    {
      key: "6",
      label: "Customer Affairs",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/customeraffair"),
    },
    {
      key: "7",
      label: "Customer Affair - Feedback",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/feedback"),
    },
    
    {
      key: "8",
      label: "Customer Affair - Complaint",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/complaint"),
    },
  ];

  const menuItems = [
    {
      key: "1",
      label: "Bookings",
      icon: <CheckCircleOutlined />,
      onClick: () => navigate("/bookings"),
    },
    {
      key: "2",
      label: "Orders",
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate("/orders"),
    },
    {
      key: "3",
      label: "Event Requests",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/event-requests"),
    },
    {
      key: "4",
      label: "Travel Requests",
      icon: <CarOutlined />,
      onClick: () => navigate("/travel-requests"),
    },
    {
      key: "5",
      label: "Additional Service Requests",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/additional-service-requests"),
    },
    {
      key: "6",
      label: "Customer Affair - Feedback",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/feedback"),
    },
    
    {
      key: "7",
      label: "Customer Affair - Complaint",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/complaint"),
    },
    
  ];

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerAuthToken");
    navigate("/login");
  };

  const menu = (
    <Menu>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.icon}
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        {/* Your logo and menu items */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={headerItems}
            style={{fontSize:'10px'}}

          />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {storedCustomerId && storedAuthToken ? (
            <>
              {/* Additional header items for authenticated users */}
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="text" style={{ color: "white" }}>
                  Menu <DownOutlined />
                </Button>
              </Dropdown>
              <Button
                type="text"
                icon={<UserSwitchOutlined />}
                style={{ color: "white" }}
              >
                User
              </Button>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                style={{ color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              type="text"
              icon={<LoginOutlined />}
              style={{ color: "white" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div style={{ minHeight: 280, padding: 24 }}>{children}</div>
      </Content>
      <StyledFooter>
        {/* Footer content */}
        <SocialIcons>{/* Social icons */}</SocialIcons>
        <ContactInfo>{/* Contact info */}</ContactInfo>
        <p>Location: 148/10, Station Road, Jaffna, Sri Lanka.</p>
        <p>Phone: +94 21 222 0111.</p>
        <p>Email: info@valampurihotel.com</p>
      </StyledFooter>
    </Layout>
  );
};

export default Template;
