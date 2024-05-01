import React from "react";
import { useRef } from "react";
import ".././styles.css";
import { Link, useNavigate } from "react-router-dom";
import { GrSecure } from "react-icons/gr";
import { usePaymentInputs } from "react-payment-inputs";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function PaymentForm() {
  const navigate = useNavigate();
  const storedCustomerId = localStorage.getItem("customerId");
  const storedAuthToken = localStorage.getItem("customerAuthToken");
  const form = useRef();
  const { meta, getExpiryDateProps, getCVCProps } = usePaymentInputs();
  const location = useLocation();
  const price = location.state?.price || "Default price"; // Fallback if no price is provided
  const firstName = location.state?.firstName; // Fallback if no price is provided
  const lastName = location.state?.lastName;
  const bookingid = location.state?.bookingid;
  const orderId = location.state?.orderId;
  const user = location.state?.user;

  const [checked, setChecked] = React.useState(true);
  const [cardNumber, setCardNumber] = React.useState("");
  const [details, setDetails] = React.useState({
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
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
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
        {meta.isTouched && meta.error ? (
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
          <label> card Number </label>
          <input
            // {...getCardNumberProps({ onChange: handleChangeCardNumber })}
            onChange={handleChangeCardNumber}
            placeholder="Valid Card Number"
            name="cardNumber"
            maxLength="19"
            value={cardNumber}
          />
        </div>
        <div className="DateEtCvc">
          <div className="Date">
            <label> ExpiryDate </label>
            <input
              {...getExpiryDateProps({ onChange: handleChange })}
              placeholder="MM/AA"
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
            Accept the term and Condations <Link href="#">confidentialite</Link>
          </p>
        </div>
        <input disabled={checked} type="submit" value="Pay" className="btn" />
      </main>
    </form>
  );
}
