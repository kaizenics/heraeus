import React, { useState } from "react";
import axios from "axios";
import "../../styles/Auth.scss";

export default function ChangePassword({ email }) {
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Use Axios for the API request
    axios.post("http://127.0.0.1:8000/api/change_password/", { email, new_password: newPassword })
      .then((response) => {
        console.log(response.data.message);
        // Password changed successfully, you can redirect to login or perform other actions
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  return (
    <>
      <section className="forgot-password-body">
        <div className="change-password-header">
          <h1>Enter your new Password</h1>
        </div>
        <div className="forgot-password-container">
          <div className="change-password-form">
            <div className="form-group-5">
              <input
                type="password"
                autoComplete="off"
                placeholder="New Password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="auth-change-pass-1">
              <button type="submit" className="change-pass-btn" onClick={handleChangePassword}>
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
