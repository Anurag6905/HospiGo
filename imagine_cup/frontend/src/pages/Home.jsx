import { useNavigate } from 'react-router-dom';
import '../CSS/Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="hero-title">
          <span className="hero-hospi">Hospi</span><span className="hero-go">GO</span>
        </h1>

        {/* Hospital Section */}
        <section className="auth-section hospital-section">
          <h3 className="section-title">Hospital</h3>
          <button
            className="auth-button hospital-button"
            onClick={() => navigate('/hospital/login')}
          >
            Hospital Login
          </button>
          <p className="register-link">
            New hospital?{' '}
            <span
              className="register-link-text"
              onClick={() => navigate('/hospital/register')}
            >
              Register here
            </span>
          </p>
        </section>

        {/* User Section */}
        <section className="auth-section user-section">
          <h3 className="section-title">User</h3>
          <button
            className="auth-button user-button"
            onClick={() => navigate('/user/login')}
          >
            User Login
          </button>
          <p className="register-link">
            New user?{' '}
            <span
              className="register-link-text"
              onClick={() => navigate('/user/register')}
            >
              Register here
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
