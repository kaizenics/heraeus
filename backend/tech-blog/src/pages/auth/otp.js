import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Auth.scss";
import { BsEnvelopeCheck } from "react-icons/bs";

export default function OTP({ email }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();

    // Use Axios for the API request
    axios.post("http://127.0.0.1:8000/api/verify_otp/", { email, otp })
      .then((response) => {
        console.log(response.data.message);
        navigate('/auth/forgot-password/change-password');
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  return (
    <>
      <section className="forgot-password-body">
        <div className="otp-header">
          <BsEnvelopeCheck className="envelop-icon" />
          <h1>Enter One-Time Password (OTP) Code</h1>
        </div>
        <div className="forgot-password-container">
          <div className="otp-form">
            <div className="form-group-4">
              <input
                type="text"
                autoComplete="off"
                placeholder="Ex. 123456"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="auth-otp-1">
              <button type="submit" className="otp-btn" onClick={handleVerify}>
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
