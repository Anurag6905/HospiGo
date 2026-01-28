import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import '../../CSS/HospitalRegistration.css';

export default function HospitalRegister() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    // Validation
    if (!name.trim()) {
      setError("Hospital name is required");
      return;
    }
    if (!latitude || isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
      setError("Valid latitude (-90 to 90) is required");
      return;
    }
    if (!longitude || isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
      setError("Valid longitude (-180 to 180) is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/hospital/register", {
        name: name.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        password: password.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/hospital/login");
      }, 2000);
    } catch (err) {
      setError("Registration failed. Hospital may already exist or invalid data.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  return (
    <div className="hospital-register-page" id="hospitalRegisterPage">
      <div className="register-container" id="registerContainer">
        <div className="register-card" id="registerCard">
          <div className="register-header" id="registerHeader">
            <h1 className="register-title" id="registerTitle">Hospital Registration</h1>
            <p className="register-subtitle">Create your hospital account</p>
          </div>

          <div className="register-form" id="registerForm">
            <div className="form-group">
              <label className="form-label" htmlFor="hospitalName">Hospital Name</label>
              <input 
                id="hospitalName"
                className="form-input" 
                type="text" 
                placeholder="Enter hospital name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || success}
              />
            </div>

            <div className="location-group">
              <div className="form-group">
                <label className="form-label" htmlFor="latitude">Latitude</label>
                <input 
                  id="latitude"
                  className="form-input location-input" 
                  type="number" 
                  step="any"
                  placeholder="e.g. 19.0760"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || success}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="longitude">Longitude</label>
                <input 
                  id="longitude"
                  className="form-input location-input" 
                  type="number" 
                  step="any"
                  placeholder="e.g. 72.8777"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hospitalPassword">Password</label>
              <input 
                id="hospitalPassword"
                className="form-input" 
                type="password" 
                placeholder="Create a secure password"
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
              <div className="error-message" id="registerError" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" id="registerSuccess" role="alert">
                <span className="success-icon">✅</span>
                Hospital registered successfully! Redirecting...
              </div>
            )}

            <button 
              className={`register-button ${loading ? 'loading' : ''} ${success ? 'success' : ''}`} 
              id="registerButton"
              onClick={register}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <span className="success-icon">✅</span>
                  Registered Successfully!
                </>
              ) : (
                'Register Hospital'
              )}
            </button>
          </div>

          <div className="register-footer">
            <p className="footer-text">
              Already registered? <a href="/hospital/register" className="login-link">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
