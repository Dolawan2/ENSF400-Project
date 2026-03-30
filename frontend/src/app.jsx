import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login_SignUp from "./pages/Login_SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/global.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

function AuthRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRoute><Login_SignUp /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
