import "./LoginPage.scss";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
function LoginPage() {
  return (
    <div className="main">
      <div className="title">
        <h1>Log in</h1>
      </div>

      <div className="email-section">
        <form action="">
          <label htmlFor="signup-email">Email</label>

          <div className="email-form">
            <input
              type="email"
              id="signup-email"
              placeholder="example@gmail.com"
            />
            <FaCheckCircle className="input-icon" />
          </div>
        </form>
      </div>

      <div className="password-section">
        {/*
          pasword form ve forgot password 
        */}

        <form action="">
          <div className="password-form">
            <label htmlFor="signup-password">Password</label>
            <input type="password" id="login-pass" placeholder="123456789" />
            <FaEyeSlash className="pass-icon" />
            <FaEye className="pass-icon" />
          </div>
        </form>

        <div className="forgot-password">
          <a href="">Forgot Password?</a>
        </div>
      </div>

      <div className="button-section">
        {/*
            login buton ve signupa atlama
          */}
        <button type="submit" className="login-button">
          Login
        </button>
      </div>
      <p>
        Don't have an account?{" "}
        <span className="bold-text">
          <a href="">Sign Up</a>
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
