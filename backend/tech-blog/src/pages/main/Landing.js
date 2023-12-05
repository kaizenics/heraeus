import "../../styles/Landing.scss";
import img from "../../images/heraeus.png";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <>
      <section className="landing-body">
        <div className="landing-container">
          <img src={img} alt="" className="front-img" />
        </div>
        <div className="text-desc">
          <p>
            Heraeus <span>Interactive</span>
          </p>
        </div>

        <p className="text-auth-desc">Welcome to Heraeus Web App</p>
        <div className="auth-buttons">
        <Link to="/auth/Login">
          <button className="auth-login-btn">Login</button>
          </Link>
          <Link to="/auth/Signup">
          <button className="auth-signup-btn">Signup</button>
          </Link>
        </div>

        <div className="end-1">
          <div></div>
        </div>

        <p className="text-auth-desc-2">Or continue with</p>

        <div className="auth-buttons-2">
          <button className="login-fb">
            <BsFacebook className="auth-icons" />
            Facebook
          </button>
          <button className="login-google">
            <FcGoogle className="auth-icons" />
            Google
          </button>
        </div>

        <footer>Niko Soriano | Heraeus Interactive © 2023</footer>
      </section>
    </>
  );
}
