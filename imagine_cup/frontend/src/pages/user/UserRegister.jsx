import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import '../../CSS/UserRegister.css';

export default function UserRegister() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !password) {
      alert("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post("/user/register", { name, password });
      navigate("/user/login");
    } catch (error) {
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-register-page">
      <div className="register-container">
        <header className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join Smart City Healthcare</p>
        </header>

        <form className="register-form" onSubmit={(e) => { e.preventDefault(); register(); }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              className="form-input name-input"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              className="form-input password-input"
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            className="register-button"
            type="submit"
            disabled={isLoading || !name || !password}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            Already have an account?{" "}
            <button 
              className="login-link"
              onClick={() => navigate("/user/login")}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
