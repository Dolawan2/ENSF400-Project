import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import "../styles/LoginForm.css";

export default function Login_SignUp() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  function switchMode(mode) {
    if (mode === action) return;
    setAction(mode);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (action === "Sign Up" && !name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (action === "Sign Up" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (action === "Sign Up") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-text">{action}</div>
        <div className="auth-underline"></div>
      </div>

      <div className="auth-inputs">
        {action === "Sign Up" && (
          <div className="auth-input">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth-input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Alert message={error} variant="error" onDismiss={() => setError('')} />

      <div className="forgot-password">
        Forgot password? <span>Click Here</span>
      </div>

      <div className="submit-container">
        <button
          type="button"
          className={action === "Sign Up" ? "submit active" : "submit gray"}
          onClick={() => action === "Sign Up" ? handleSubmit(new Event('submit')) : switchMode("Sign Up")}
          disabled={loading}
        >
          Sign Up
        </button>

        <button
          type="button"
          className={action === "Login" ? "submit active" : "submit gray"}
          onClick={() => action === "Login" ? handleSubmit(new Event('submit')) : switchMode("Login")}
          disabled={loading}
        >
          Login
        </button>
      </div>
    </div>
  );
}
