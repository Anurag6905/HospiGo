// src/pages/hospital/HospitalLogin.jsx (or appropriate path)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import '../../CSS/HospitalLogin.css';  // You'll need to create this CSS file matching HospitalRegistration.css styling

export default function HospitalLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    // Validation
    if (!name.trim()) {
      setError("Hospital name is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const res = await api.post("/hospital/login", {
        name: name.trim(),
        password: password.trim(),
      });
     
      if (res.data && res.data.hospital_id) {
      localStorage.setItem("hospital_id", res.data.hospital_id);
      localStorage.setItem("hospital_name", res.data.name);
      } else {
      console.error("No hospital_id in login response:", res.data);
      }
       // Assuming successful response sets some token or auth state
      setSuccess(true);
      setTimeout(() => {
        navigate("/hospital/dashboard");
      }, 2000);
    } catch (err) {
      setError("Invalid hospital credentials. Please check name and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="hospital-login-page" id="hospitalLoginPage">  {/* Matches registration structure */}
      <div className="register-container" id="loginContainer">
        <div className="register-card" id="loginCard">
          <div className="register-header" id="loginHeader">
            <h1 className="register-title" id="loginTitle">Hospital Login</h1>
            <p className="register-subtitle">Access Smart City Healthcare Dashboard</p>
          </div>

          <div className="register-form" id="loginForm">
            <div className="form-group">
              <label className="form-label" htmlFor="hospitalLoginName">Hospital Name</label>
              <input 
                id="hospitalLoginName"
                className="form-input" 
                type="text" 
                placeholder="Enter hospital name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || success}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hospitalLoginPassword">Password</label>
              <input 
                id="hospitalLoginPassword"
                className="form-input" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || success}
              />
              <div className="password-requirement">
                Minimum 6 characters required
              </div>
            </div>

            {error && (
              <div className="error-message" id="loginError" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" id="loginSuccess" role="alert">
                <span className="success-icon">✅</span>
                Login successful! Redirecting to dashboard...
              </div>
            )}

            <button 
              className={`register-button ${loading ? 'loading' : ''} ${success ? 'success' : ''}`} 
              id="loginButton"
              onClick={login}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Logging In...
                </>
              ) : success ? (
                <>
                  <span className="success-icon">✅</span>
                  Logged In Successfully!
                </>
              ) : (
                'Login to Hospital Dashboard'
              )}
            </button>
          </div>

          <div className="register-footer">
            <p className="footer-text">
              Not registered? <a href="/hospital/register" className="login-link">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
