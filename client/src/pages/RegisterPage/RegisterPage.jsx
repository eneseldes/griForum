import "./RegisterPage.scss";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
function RegisterPage() {
  return (
    <div className="main">
      <div className="title">
        <h1>Sign Up</h1>
      </div>

      <div className="email-section">
        <form action="">
          <div className="email-form">
            <label for="signup-email">Email</label>
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
            <label for="signup-password">Create a password</label>
            <input type="password" id="login-pass" placeholder="123456789" />
            <FaEyeSlash className="pass-icon"/>
            <FaEye className="pass-icon"/>
          </div>
        </form>

        
      </div>

      <div className="password-section">
        
        <form action="">
          <div className="password-form">
            <label for="signup-password">Confirm password</label>
            <input type="password" id="login-pass" placeholder="123456789" />
            <FaEyeSlash className="pass-icon"/>
            <FaEye className="pass-icon"/>
          </div>
        </form>

      </div>

      <div className="button-section">
        {/*
                login buton ve signupa atlama
              */}
        <button type="submit" className="login-button">
          Login
        </button>
      </div>
      <p>Already have an account? <span className="bold-text"> <a href=""> Log in</a></span></p>
    </div>
  );
}

export default RegisterPage;
