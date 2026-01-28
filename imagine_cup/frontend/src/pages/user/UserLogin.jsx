import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import '../../CSS/UserLogin.css';

export default function UserLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!name || !password) {
      alert("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post("/user/login", { name, password });
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/user/services");
    } catch (error) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </header>

        <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(); }}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input 
              className="form-input username-input"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              className="form-input password-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-actions">
            <label className="remember-label">
              <input type="checkbox" className="checkbox" />
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button 
            className="login-button"
            type="submit"
            disabled={isLoading || !name || !password}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{" "}
            <button 
              className="register-link"
              onClick={() => navigate("/user/register")}
              disabled={isLoading}
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
