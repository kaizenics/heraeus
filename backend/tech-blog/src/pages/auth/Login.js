import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Auth.scss';
import img from '../../images/heraeus.png';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      alert('Please enter both username and password');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
      console.log(response.data);
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('username', formData.username);
        alert('Login successful');
        navigate('/main/Home');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  useEffect(() => {
    document.title = "Login | Heraeus Interactive";

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

          <p className="text-auth-desc-2">Please login to continue</p>

          <div className="box-container">
            <div className="login-box">
              <h2>Username</h2>
              <div className="form-group">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder=""
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <h2>Password</h2>
              <div className="form-group">
                <input
                  type="password"
                  autoComplete="off"
                  placeholder=""
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="auth-btn">
            <button className="auth-login-btn-2" onClick={handleLogin}>
              Login
            </button>
            <p>
              Forgot password? <span>
                <Link to="/auth/forgot-password" className="forgot-pw">Click here</Link>
              </span>
            </p>
          </div>

          <div className="end-2">
            <div></div>
          </div>

          <div className="auth-btn">
            <Link to="/auth/Signup">
              <button className="auth-signup-btn-2">Create new account</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
