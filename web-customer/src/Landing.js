import React, { useState, useEffect } from "react";
import {
  Carousel,
  DatePicker,
  Button,
  Form,
  Modal,
  Typography,
  Rate,
  InputNumber,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import videoSrc from "./video.mp4";
import axios from "axios";
import BookingForm from "./Booking/BookingForm";

const FeedbackCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;

  .user-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .rating {
    margin-bottom: 10px;
  }

  .comment {
    font-size: 16px;
    text-align: center;
  }
`;

const FeedbackSection = styled.div`
  text-align: center;
  margin: 40px 0;
  padding: 0 20px;

  .feedback-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .feedback-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  margin-top: 40px;
  video {
    width: 100%;
    height: auto;
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;

const TextContainer = styled.div`
  flex: 1;
  padding: 0 20px;
`;

const ImageContainer = styled.div`
  flex: 1;
  padding: 0 20px;
`;

const Landing = () => {
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);
  const [, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [capacity, setCapacity] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(false);
  const [openBookingForm, setOpenBooking] = useState(false);
  const [form] = Form.useForm();

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/rooms`
      );
      setRoomData(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const hotelImages = [
    "https://c4.wallpaperflare.com/wallpaper/787/399/647/life-resort-travel-vacation-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/670/742/573/hotel-resort-tropical-pier-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/524/228/970/life-interior-home-room-wallpaper-preview.jpg",
    "https://c4.wallpaperflare.com/wallpaper/816/667/640/life-room-home-interior-wallpaper-preview.jpg",
  ];
  const userFeedback = [
    {
      userImage: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      comment: "Excellent service and beautiful rooms!",
    },
    {
      userImage: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4,
      comment: "Great experience, would definitely come again.",
    },
    {
      userImage: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 3.5,
      comment: "Nice place, but could improve on cleanliness.",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotelImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [hotelImages.length]);

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select both check-in and check-out dates!",
      });
      return;
    }
  };

  const handleBookClick = (room) => {
    if (storedAuthToken && storedCustomerId) {
      setSelectedRoom(room._id);
      setOpenBooking(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please login for make bookings!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const handleBookingClose = () => {
    setSelectedRoom(null);
    setOpenBooking(false);
    form.resetFields();
  };

  const handleBooking = async (values) => {
    if (storedAuthToken && storedCustomerId) {
      const payload = { ...values, user: storedCustomerId, room: selectedRoom };
      try {
        let response = null;
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/`,
          payload,
          {
            headers: {
              Authorization: storedAuthToken,
            },
          }
        );

        if (response.data.success) {
          setOpenBooking(false);
          setSelectedRoom(null);
          form.resetFields();
          message.success(`Booking created successfully`);
          navigate("/bookings");
        }
      } catch (error) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <VideoContainer>
        <video autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </VideoContainer>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <DatePicker
          placeholder="Check-in"
          style={{ marginRight: "10px", width: 400 }}
          value={checkInDate}
          onChange={(date) => setCheckInDate(date)}
        />
        <DatePicker
          placeholder="Check-out"
          style={{ marginRight: "10px", width: 400 }}
          value={checkOutDate}
          onChange={(date) => setCheckOutDate(date)}
        />
        <InputNumber
          placeholder="Room Size"
          min={1}
          max={10}
          defaultValue={1}
          value={capacity}
          style={{ marginRight: "10px", width: 100 }}
          onChange={(value) => setCapacity(value)}
        />
        <Button type="primary" onClick={handleSearch}>
          <SearchOutlined />
          Search
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${roomData.length}, minmax(0, 1fr))`,
          gap: "20px",
          margin: "20px",
          justifyContent: "center",
        }}
      >
        {roomData.map((room, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Carousel className="room-slider" autoplay>
              {room.imageUrls.map((imageUrl, imageIndex) => (
                <div key={imageIndex}>
                  <img
                    className="room-image"
                    alt={`${room.description} - Image ${imageIndex + 1}`}
                    src={imageUrl}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </Carousel>
            <div style={{ padding: "16px" }}>
              <Typography.Title
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {room.description}
              </Typography.Title>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                with {room.amenities.join(", ")}
              </p>
              <p
                style={{ fontSize: "16px", color: "#666", marginBottom: "8px" }}
              >
                for {room.capacity} person
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {room.price} LKR
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#777",
                  marginBottom: "16px",
                }}
              >
                {room.availability ? "Available" : "Not Available"}
              </p>
              <Button type="primary" onClick={() => handleBookClick(room)}>
                Book
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Container>
        <TextContainer>
          <h2>Nashville's Premier Boutique Hotel</h2>
          <h3>Studio 154 Luxury Hotel & SKYDECK</h3>
          <p>
            Studio 154 Luxury Hotel & SKYDECK is downtown Nashville’s first
            state-of-the-art boutique hotel that utilizes digital key technology
            to perfectly overhaul the modern vacationing experience. Our guests
            enjoy the city from a prime location that is just steps away from
            Broadway as well as the Ryman Auditorium, Bridgestone Arena, and the
            Ascend Amphitheater.
          </p>
          <p>
            The original exposed brick walls from the mid 19th century,
            22-foot-tall ceilings, and 10-foot-tall arched windows combined with
            the luxury furnishings provide a warm contemporary feel.
          </p>
          <p>
            At SKYDECK, our hotel’s exclusive rooftop venue, guests have a
            front-row seat and birds-eye view of Nissan Stadium, CMA Fest,
            concerts on the waterfront, fireworks, and other major Nashville
            events.
          </p>
        </TextContainer>
        <ImageContainer>
          <img
            src="https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg?s=612x612&w=0&k=20&c=rz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o="
            alt="Placeholder"
            style={{ width: "100%", height: "auto" }}
          />
        </ImageContainer>
      </Container>
      <FeedbackSection>
        <Typography.Title
          level={3}
          className="feedback-title"
          style={{ fontSize: "35px", fontWeight: "bold" }}
        >
          What Others Say
        </Typography.Title>
        <div className="feedback-container">
          {userFeedback.map((feedback, index) => (
            <FeedbackCardContainer key={index}>
              <img
                className="user-image"
                src={feedback.userImage}
                alt={`User ${index + 1}`}
              />
              <Rate
                className="rating"
                allowHalf
                disabled
                defaultValue={feedback.rating}
              />
              <div className="comment">{feedback.comment}</div>
            </FeedbackCardContainer>
          ))}
        </div>
      </FeedbackSection>

      <div style={{ height: "400px", width: "100%", overflow: "hidden" }}>
        <Carousel autoplay>
          {hotelImages.map((imageUrl, index) => (
            <div
              key={index}
              style={{ height: "100%", width: "100%", textAlign: "center" }}
            >
              <img
                src={imageUrl}
                alt={`Hotel ${index + 1}`}
                style={{ width: "100%", objectFit: "cover", height: "100%" }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <Modal open={openBookingForm} footer={null} onCancel={handleBookingClose}>
        <BookingForm onFinish={handleBooking} form={form} />
      </Modal>
    </div>
  );
};

export default Landing;
