import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.scss";
import img from "../images/heraeus.png";
import { GoHome } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (!isLoggedIn && shouldRedirect) {
      window.location.href = "/";
    }
  }, [isLoggedIn, shouldRedirect]);

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout/");
      alert("Logout successful");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');

    setIsLoggedIn(false);
    setShouldRedirect(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="image">
          <Link to="/">
            <img src={img} alt="icon" />
          </Link>
          <p>
            Heraeus <span>Interactive</span>
          </p>
        </div>

        <div className="navbar-nav">
          <div className="user-info">
            <p>Welcome, {username || 'Guest'}!</p>
          </div>
          <a href="/main/Home">
            <GoHome className="nav-icons" />
          </a>
          <IoLogOutOutline className="nav-icons" onClick={handleLogout} />
        </div>
      </nav>
    </>
  );
}
