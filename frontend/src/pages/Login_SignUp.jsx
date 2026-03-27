import { useState } from "react";
import "../styles/LoginForm.css";

export default function Login_SignUp() {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-text">{action}</div>
        <div className="auth-underline"></div>
      </div>

      <div className="auth-inputs">
        {action === "Sign Up" && (
          <div className="auth-input">
            <input type="text" placeholder="Name" />
          </div>
        )}

        <div className="auth-input">
          <input type="email" placeholder="Email" />
        </div>

        <div className="auth-input">
          <input type="password" placeholder="Password" />
        </div>
      </div>

      <div className="forgot-password">
        Forgot password? <span>Click Here</span>
      </div>

      <div className="submit-container">
        <button
          className={action === "Sign Up" ? "submit active" : "submit"}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </button>

        <button
          className={action === "Login" ? "submit active" : "submit gray"}
          onClick={() => setAction("Login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}