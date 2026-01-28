// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    age: '',
    gender: '',
    city: 'Mumbai',
    emergencyContact: '',
    allergies: '',
    chronicConditions: '',
    preferredHospital: 'Apollo Hospital'
  });

  const [stats, setStats] = useState({
    doctorAppointments: 3,
    labBookings: 2,
    upcoming: 1
  });

  // Load from localStorage (mock user profile)
  useEffect(() => {
    const saved = localStorage.getItem('hospi_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      const defaultName = localStorage.getItem('username') || 'HospiGo User';
      setProfile(prev => ({ ...prev, name: defaultName }));
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem('hospi_user_profile', JSON.stringify(profile));
    setEditing(false);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button onClick={() => navigate('/user/services')} className="back-btn" />
        <div className="logo-section">
          <img src="/logo.png" alt="HospiGo" className="logo-circle" />
          <span className='logo-text'>Hospi<span>Go</span></span>
        </div>
        <button 
          className={`edit-btn ${editing ? 'active' : ''}`} 
          onClick={() => setEditing(prev => !prev)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-main">
        {/* Left: User card + stats */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="avatar-circle">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2>{profile.name}</h2>
            <p className="user-city">{profile.city || 'City'}</p>

            <div className="health-badge">
              <span className="label">Blood Group</span>
              <span className="value">{profile.bloodGroup || 'Not set'}</span>
            </div>

            <div className="quick-stats">
              <div className="stat">
                <div className="stat-number">{stats.doctorAppointments}</div>
                <div className="stat-label">Doctor Visits</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.labBookings}</div>
                <div className="stat-label">Lab Tests</div>
              </div>
              <div className="stat">
                <div className="stat-number highlight">{stats.upcoming}</div>
                <div className="stat-label">Upcoming</div>
              </div>
            </div>

            <button 
              className="primary-btn" 
              onClick={() => navigate('/user/appointments')}
            >
              View Appointments
            </button>
          </div>

          <div className="tags-card">
            <h3>Your Preferences</h3>
            <div className="tag-list">
              {profile.preferredHospital && (
                <span className="pill">{profile.preferredHospital}</span>
              )}
              {profile.city && (
                <span className="pill">{profile.city}</span>
              )}
              <span className="pill ghost">Fast check-in</span>
              <span className="pill ghost">Digital reports</span>
            </div>
          </div>
        </div>

        {/* Right: Editable form */}
        <div className="profile-content">
          <div className="section-card">
            <h3>Personal Information</h3>
            <div className="grid-2">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => handleChange('name', e.target.value)}
                  disabled={!editing}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => handleChange('email', e.target.value)}
                  disabled={!editing}
                  placeholder="name@example.com"
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  disabled={!editing}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="field">
                <label>City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={e => handleChange('city', e.target.value)}
                  disabled={!editing}
                  placeholder="Mumbai"
                />
              </div>
              <div className="field">
                <label>Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={e => handleChange('age', e.target.value)}
                  disabled={!editing}
                  placeholder="24"
                />
              </div>
              <div className="field">
                <label>Gender</label>
                <select
                  value={profile.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3>Medical Details</h3>
            <div className="grid-3">
              <div className="field">
                <label>Blood Group</label>
                <select
                  value={profile.bloodGroup}
                  onChange={e => handleChange('bloodGroup', e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </div>
              <div className="field">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={profile.emergencyContact}
                  onChange={e => handleChange('emergencyContact', e.target.value)}
                  disabled={!editing}
                  placeholder="Emergency phone"
                />
              </div>
              <div className="field">
                <label>Preferred Hospital</label>
                <input
                  type="text"
                  value={profile.preferredHospital}
                  onChange={e => handleChange('preferredHospital', e.target.value)}
                  disabled={!editing}
                  placeholder="Apollo, Lilavati..."
                />
              </div>
            </div>

            <div className="field">
              <label>Allergies</label>
              <textarea
                rows="2"
                value={profile.allergies}
                onChange={e => handleChange('allergies', e.target.value)}
                disabled={!editing}
                placeholder="e.g. Penicillin, Dust, Pollen"
              />
            </div>
            <div className="field">
              <label>Chronic Conditions</label>
              <textarea
                rows="2"
                value={profile.chronicConditions}
                onChange={e => handleChange('chronicConditions', e.target.value)}
                disabled={!editing}
                placeholder="e.g. Asthma, Diabetes, Hypertension"
              />
            </div>
          </div>

          {editing && (
            <div className="actions-row">
              <button className="secondary-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
