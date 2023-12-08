import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../../styles/Auth.scss";

export default function ForgotPassword({ setEmail }) {
  const [email, setEmailValue] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    axios.post("http://127.0.0.1:8000/api/send_otp/", { email })
      .then((response) => {
        console.log(response.data.message);
        setEmail(email);
        navigate('/auth/forgot-password/otp');
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setErrors({ email: error.response.data.error });
        }
      });
  };

  return (
    <>
      <section className="forgot-password-body">
        <div className="forgot-password-header">
          <h1>Forgot Password</h1>
          <p>Please enter your email to send an One-Time Password (OTP) directly to your email</p>
        </div>
        <div className="forgot-password-container">
          <div className="forgot-password-form">
            <h2>Email</h2>
            <div className="form-group-3">
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              {errors.email && (<p className="error-text">{errors.email}</p>)}
            </div>
            <div className="auth-forgot-1">
              <button type="submit" className="forgot-password-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
