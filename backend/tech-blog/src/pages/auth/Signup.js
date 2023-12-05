import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Auth.scss";
import img from "../../images/heraeus.png";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );
      console.log(response.data);
      alert("Signup successful");
      navigate("/auth/Login");
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  };

  useEffect(() => {
    document.title = "Sign Up | Heraeus Interactive";

    return () => {
      document.title = "Heraeus Interactive";
    };
  }, []);

  return (
    <>
      <section className="login-auth-body">
        <div className="login-auth-body">
          <div className="image-ctn">
            <img src={img} alt="" className="front-img" />
          </div>
          <div className="text-desc-2">
            <p>
              Heraeus <span>Interactive</span>
            </p>
          </div>

          <p className="text-auth-desc-2">Please signup to continue</p>

          <div className="box-container">
            <div className="login-box-1">
              <form onSubmit={handleSubmit}>
                <h2>Username</h2>
                <div className="form-group-2">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder=""
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <h2>Email</h2>
                <div className="form-group-2">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder=""
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <h2>Password</h2>
                <div className="form-group-2">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder=""
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <h2>Confirm Password</h2>
                <div className="form-group-2">
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder=""
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="auth-btn-1">
                  <button type="submit" className="auth-login-btn-3">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
