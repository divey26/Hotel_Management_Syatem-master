import React from "react";
import { Card, Typography, Avatar } from "antd";

const { Title, Paragraph } = Typography;

const CardView = ({ title, description, icon }) => {
  return (
    <Card
      className="animated-card zoomed-card"
      style={{
        backgroundColor: "#8EB1E1",
        borderRadius: "10px",
        
      }}
    >
      <Avatar
        icon={icon}
        style={{
          backgroundColor: "#022555",
          borderRadius: "8px",
          width: "60px",
          height: "60px",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      />
      <Title
        level={3}
        style={{
          fontFamily: "Quicksand",
          fontSize: "22px",
          fontWeight: "600",
          marginBottom: "8px",
          marginTop: 5,
        }}
      >
        {title}
      </Title>
      <Paragraph
        style={{
          fontFamily: "Quicksand",
          fontSize: "16px",
          fontWeight: "400",
          wordWrap: "break-word",
          marginTop: -10,
        }}
      >
        {description}
      </Paragraph>
    </Card>
  );
};

export default CardView;
