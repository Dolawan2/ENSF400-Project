import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login_SignUp from "./pages/Login_SignUp";
import "./styles/global.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
}

function AuthRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Welcome, {user.name}!</h2>
      <p>Role: {user.role}</p>
      <button onClick={logout} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRoute><Login_SignUp /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
