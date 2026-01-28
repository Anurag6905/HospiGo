import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../CSS/Confirmation.css';

export default function AppointmentConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isLab = state?.labId;
  const title = isLab ? 'Lab Test Confirmed!' : 'Appointment Confirmed!';
  const subtitle = isLab ? 'Your lab test has been scheduled' : 'Your doctor appointment is confirmed';

  const confirmationData = isLab ? {
    type: 'Lab Test',
    name: state?.labName || 'Test',
    hospital: state?.hospital || '',
    date: state?.date ? state.date.toDateString() : '',
    time: state?.time || '',
    id: state?.labId || '',
    price: '₹450'
  } : {
    type: 'Doctor Appointment',
    name: state?.doctorName || 'Doctor',
    hospital: state?.hospital || '',
    date: state?.date ? state.date.toDateString() : '',
    time: state?.time || '',
    id: state?.doctorId || '',
    specialty: 'Cardiology'
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const downloadPDF = () => {
    const content = `
HospiGo ${confirmationData.type} Confirmation

Test/Appointment: ${confirmationData.name}
Hospital: ${confirmationData.hospital}
Date: ${confirmationData.date}
Time: ${confirmationData.time}
Confirmation ID: #${confirmationData.id}

Thank you for choosing HospiGo!
    `;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `HospiGo-${confirmationData.type.replace(/\s+/g, '-').toLowerCase()}-${confirmationData.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="confirmation-loading">
        <div className="success-icon">
          <div className="checkmark" />
        </div>
        <h1>Confirming your booking...</h1>
        <div className="spinner-large" />
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      {/* Header */}
      <div className="confirmation-header">
        <button onClick={() => navigate(-1)} className="back-btn" />
        <div className="logo-section">
          <img src="/logo.png" alt="HospiGo" className="logo-circle" />
          <span className='logo-text'>Hospi<span>Go</span></span>
        </div>
        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/user/appointments')}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="confirmation-main">
        {/* Success Banner */}
        <div className="success-banner">
          <div className="success-icon-large">
            <div className="checkmark-large" />
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {/* Confirmation Card */}
        <div className="confirmation-card">
          <div className="card-header">
            <div className="type-badge">{confirmationData.type}</div>
            <div className="status-badge confirmed">Confirmed</div>
          </div>

          <div className="card-body">
            <div className="detail-row">
              <div className="detail-label">{isLab ? 'Test Name' : 'Doctor'}</div>
              <div className="detail-value">{confirmationData.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Hospital</div>
              <div className="detail-value">{confirmationData.hospital}</div>
            </div>
            <div className="detail-row appointment-details">
              <div className="detail-label">Date & Time</div>
              <div className="detail-value">
                <div className="datetime">
                  <span className="date">{confirmationData.date}</span>
                  <span className="time">{confirmationData.time}</span>
                </div>
              </div>
            </div>
            {isLab && (
              <div className="detail-row">
                <div className="detail-label">Price</div>
                <div className="detail-value price">₹450</div>
              </div>
            )}
            <div className="detail-row">
              <div className="detail-label">Confirmation ID</div>
              <div className="detail-value id">#APT-{confirmationData.id}</div>
            </div>
          </div>

          <div className="card-actions">
            <button className="download-btn" onClick={downloadPDF}>
              <svg viewBox="0 0 24 24" className="btn-icon">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download Receipt
            </button>
            <button className="reschedule-btn" onClick={() => navigate(-1)}>
              Reschedule
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>What happens next?</h3>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <p>Arrive 15 mins early</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Show confirmation ID</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Get results in app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
