import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import logo from "../assets/logo.jpeg";
import { useNotifications } from "../context/NotificationContext";
import { API_BASE_URL } from "../config";
import googleLogo from "../assets/google-color.svg";

const Login = () => {
  const { login } = useAuth();
  const { showAlert } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");   // ✅ Added error state

  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "SHO") navigate("/sho");
    else navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error

    if (!email || !password) {
      setError("Please enter email and password");
      showAlert("Please enter email and password", "Validation Error", "error");
      return;
    }

    try {
      const data = await loginUser({ email, password });

      console.log("Login response:", data);

      if (!data || !data.token) {
        setError("Invalid credentials");
        showAlert("Invalid credentials", "Login Failed", "error");
        return;
      }

      localStorage.clear();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("station", data.station);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("officerId", data.userId);

      login({
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        station: data.station,
        userId: data.userId
      });

      redirectByRole(data.role);

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      showAlert("Login failed. Please try again.", "Login Failed", "error");
    }
  };

  const handleGoogleLogin = async () => {
    setError(""); // clear previous error

    try {
      const googleEmail = "googleuser@police.gov";

      const response = await fetch(
        `${API_BASE_URL}/auth/google-login?email=${googleEmail}`,
        { method: "POST" }
      );

      if (!response.ok) {
        setError("Email not registered in system");
        showAlert("Email not registered in system", "Login Failed", "error");
        return;
      }

      const data = await response.json();

      localStorage.clear();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("station", data.station);
      localStorage.setItem("userId", data.userId);

      login({
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        station: data.station,
        userId: data.userId
      });

      redirectByRole(data.role);

    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
      showAlert("Google login failed. Please try again.", "Login Failed", "error");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex"
      style={{
        background: "linear-gradient(135deg,#020617,#0f172a)",
      }}
    >
      <div className="w-50 d-flex align-items-center justify-content-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 text-center">
            <img
              src={logo}
              alt="SecureFile Logo"
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "10%",
                objectFit: "cover",
                border: "4px solid #38bdf8",
                boxShadow: "0 0 25px rgba(56,189,248,0.6)",
              }}
            />
          </div>

          <h1 className="fw-bold">SecureFile</h1>
          <p className="text-secondary">
            Crime Record Management System
          </p>
        </div>
      </div>

      <div className="w-50 d-flex align-items-center justify-content-center">
        <form
          onSubmit={handleLogin}
          className="p-5 rounded-4 text-white"
          style={{
            width: "480px",
            background: "rgba(2,6,23,0.85)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 60px rgba(0,0,0,0.6)",
          }}
        >
          <h3 className="mb-4">Sign In</h3>

          <div className="mb-3">
            <label className="mb-1">Email</label>
            <input
              type="email"
              className="form-control text-white"
              placeholder="officer@police.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "12px",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="mb-1">Password</label>
            <input
              type="password"
              className="form-control text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "12px",
              }}
            />
          </div>

          {/* ✅ Error Message Display (No Design Change) */}
          {error && (
            <div
              className="mb-3"
              style={{
                color: "#f87171",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-100 mb-4 btn btn-primary py-3 rounded-3 fw-medium"
          >
            Sign In
          </button>

          <div className="text-center text-secondary mb-3">
            ───── OR ─────
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-100 d-flex align-items-center justify-content-center gap-2 text-white bg-transparent border border-secondary rounded-3 py-3"
          >
          <img
  src={googleLogo}
  alt="Google"
  width="20"
  height="20"
/>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;