import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginForm.css";

export default function Login_SignUp() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
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
    <form className="auth-container" onSubmit={handleSubmit}>
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
              required
            />
          </div>
        )}

        <div className="auth-input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="forgot-password">
        Forgot password? <span>Click Here</span>
      </div>

      <div className="submit-container">
        <button
          type={action === "Sign Up" ? "submit" : "button"}
          className={action === "Sign Up" ? "submit active" : "submit gray"}
          onClick={() => { if (action !== "Sign Up") setAction("Sign Up"); }}
          disabled={loading}
        >
          Sign Up
        </button>

        <button
          type={action === "Login" ? "submit" : "button"}
          className={action === "Login" ? "submit active" : "submit gray"}
          onClick={() => { if (action !== "Login") setAction("Login"); }}
          disabled={loading}
        >
          Login
        </button>
      </div>
    </form>
  );
}
