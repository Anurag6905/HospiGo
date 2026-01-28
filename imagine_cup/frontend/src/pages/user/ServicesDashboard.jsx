import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; // Unused here but kept for future
import '../../CSS/ServicesDashboard.css';

export default function ServicesDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userid');
    setUserId(id);
  }, []);

  const services = [
    {
      id: 'doctors',
      title: 'Doctors Appointment',
      description: 'Book specialist consultation',
      icon: '', // Add icon SVG if needed
      image: '../../../public/appointment.jpg',
    },
    {
      id: 'beds',
      title: 'Hospital Bed Booking',
      description: 'Book ICU/CCU beds',
      icon: '',
      image: '../../../public/bed.jpg',
    },
    {
      id: 'lab',
      title: 'Lab Appointment',
      description: 'Diagnostic tests',
      icon: '',
      image: '../../../public/lab.jpg',
    },
    {
      id: 'emergency',
      title: 'Emergency Care',
      description: '24/7 ambulance service',
      icon: '',
      image: '../../../public/emergency.jpg',
      badge: 'Available Now',
    },
  ];

  const handleServiceClick = (service) => {
    if (service.id === 'doctors') {
      // Fixed hospital=1 navigates to BookAppointment
      navigate(`/user/appointments`);
    } else if (service.id === 'beds') {
      navigate('/user/dashboard');
    } else if (service.id === 'lab') {
      navigate('/user/labs');
    }
  };

  return (
    <div className="services-dashboard">
      {/* HEADER - HospiGo logo */}
      <div className="dashboard-header">
        <div className="logo-section">
          <img src="/logo.png" alt="HospiGo" className="logo-circle" />
          <span className='logo-text'>Hospi<span>Go</span></span>
        </div>
        <button className="profile-btn4" onClick={() => navigate('/user/profile')}>
            <img src='../../../public/user.png'></img>
        </button>
        {userId && (
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('userid');
            navigate('/user/login');
          }}>
            Logout
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="welcome-section">
          <h1>Book Services</h1>
          <p>Choose your service type</p>
        </div>

        {/* SERVICES GRID - 2x2 like image */}
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.badge ? 'featured' : ''}`}
              onClick={() => handleServiceClick(service)}
            >
              <div className="service-image">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="service-info">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                {service.hospital && <div className="service-hospital">{service.hospital}</div>}
              </div>
              <div className="service-actions">
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
