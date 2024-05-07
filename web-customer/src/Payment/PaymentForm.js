import React, { useState } from "react";
import { useRef } from "react";
import ".././styles.css";
import { Link, useNavigate } from "react-router-dom";
import { GrSecure } from "react-icons/gr";
import { usePaymentInputs } from "react-payment-inputs";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {message} from "antd"

export default function PaymentForm() {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const form = useRef();
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();
  const location = useLocation();
  const price = location.state?.price || "Default price";
  const firstName = location.state?.firstName;
  const lastName = location.state?.lastName;
  const bookingid = location.state?.bookingid;
  const orderId = location.state?.orderId;
  const user = location.state?.user;

  const [checked, setChecked] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [details, setDetails] = useState({
    expiryDate: "",
    cvc: "",
    name: "",
  });

  const handleChangeCardNumber = (e) => {
    setCardNumber(
      e.target.value
        .replace(/[^\dA-Z]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "expiryDate") {
      // Validate MM/YY format
      if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        const [month, year] = value.split("/");
        const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
        const inputYear = parseInt(year, 10);
        if (inputYear >= currentYear) {
          setDetails((prev) => ({ ...prev, [name]: value }));
        }
      }
    } else {
      setDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    console.log('dfsnvghvgvbkv')
    console.log(cardNumber)
    if(!cardNumber){
      message.error("Card number not given!")
    }
    e.preventDefault();
    if (meta.isTouched && meta.error) {
      console.error("Form errors must be resolved before submitting!");
      return;
    }
    if (storedCustomerId && storedAuthToken) {
      if (window.confirm("Do you want to proceed with the payment?")) {
        try {
          const paymentData = {
            user: user,
            status: "Received",
            paidVia: "online",
            paidOn: new Date(),
            totalPrice: price,
            order: orderId,
            booking: bookingid,
          };
          const paymentUpdateResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/payments`,
            paymentData
          );

          if (paymentUpdateResponse.data.success) {
            const payload = {
              status: "Confirmed",
            };
            if (bookingid) {
              const bookingUpdateResponse = await axios.put(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/bookings/${bookingid}`,
                payload
              );
              if (bookingUpdateResponse.data.success) {
                navigate("/bookings");
              }
            }
            if (orderId) {
              const bookingUpdateResponse = await axios.put(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/orders/${orderId}`,
                payload
              );
              if (bookingUpdateResponse.data.success) {
                navigate("/orders");
              }
            }
          }
        } catch (error) {
          console.error("Payment submission failed", error);
        }
      }
    }
  };

  const handleCheck = () => {
    setChecked(false);
  };

  return (
    <form ref={form} className="form" onSubmit={handleSubmit}>
      <header>
        <div className="TitleSecure">
          <h3>Payment Details </h3>
          <GrSecure className="secureIcon" />
        </div>
        <div className="Amont">
          <p> Amount : </p>
          <label className="price">{price}Rs</label>
        </div>
      </header>
      <main>
        {meta.onSubmit && meta.error ? (
          <span className="span">Error: {meta.error}</span>
        ) : (
          <span className="span"></span>
        )}
        <div className="name">
          <label> Client Name : </label>
          <label className="cname" style={{ fontWeight: "bold" }}>
            {firstName} {lastName}
          </label>
        </div>
        <div className="cardNumber">
          <label> Card Number </label>
          <input
            {...getCardNumberProps({ onChange: handleChangeCardNumber })}
            placeholder="Valid Card Number"
            maxLength="19"
            value={cardNumber}
          />
        </div>
        <div className="DateEtCvc">
          <div className="Date">
            <label> ExpiryDate </label>
            <input
              {...getExpiryDateProps({ onChange: handleChange })}
              placeholder="MM/YY"
              name="expiryDate"
            />
          </div>
          <div className="CvC">
            <label> CvC</label>
            <input
              {...getCVCProps({ onChange: handleChange })}
              name="cvc"
              maxLength="3"
            />
          </div>
        </div>
        <div className="terme">
          <input type="checkbox" onChange={handleCheck} />
          <p className="TermeConfidentialite">
            Accept the term and Condations <Link to="#">confidentialite</Link>
          </p>
        </div>
        <input disabled={checked} type="submit" value="Pay" className="btn" />
      </main>
    </form>
  );
}
