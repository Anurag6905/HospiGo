import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Globe, BedDouble, ShieldCheck, PenSquare, Save, X } from 'lucide-react';
import '../../CSS/HospitalProfile.css';

export default function HospitalProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial State (Mock Data)
  const [profile, setProfile] = useState({
    name: 'City General Hospital',
    type: 'Multi-Specialty',
    regNumber: 'HOSP-MUM-2024-8921',
    phone: '+91 98765 43210',
    email: 'admin@citygeneral.com',
    website: 'www.citygeneral.com',
    address: '12, Link Road, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
    totalBeds: '150',
    icuBeds: '25',
    emergencyUnits: '8',
    ambulances: '4',
    description: 'A leading healthcare provider committed to excellence in medical care and patient safety. Equipped with state-of-the-art facilities.',
    image: null // URL or base64 string
  });

  // Load from local storage on mount (simulating API fetch)
  useEffect(() => {
    const savedProfile = localStorage.getItem('hospital_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    // Simulate loading delay
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save to local storage (or API)
    localStorage.setItem('hospital_profile', JSON.stringify(profile));
    localStorage.setItem('hospital_name', profile.name); // Update global name
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  const handleCancel = () => {
    // Revert changes by reloading from storage
    const savedProfile = localStorage.getItem('hospital_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsEditing(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="hospital-profile-page">
      <div className="profile-container">
        
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/hospital/dashboard')} className="back-btn-profile">
            ← Back
          </button>
          <div className="header-actions">
            {isEditing ? (
              <>
                <button className="action-btn cancel" onClick={handleCancel}>
                  <X size={18} /> Cancel
                </button>
                <button className="action-btn save" onClick={handleSave}>
                  <Save size={18} /> Save Changes
                </button>
              </>
            ) : (
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>
                <PenSquare size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-grid">
          
          {/* Left Column: Identity Card */}
          <div className="profile-sidebar-card glass-panel">
            <div className="hospital-avatar">
              {profile.image ? (
                <img src={profile.image} alt="Hospital" />
              ) : (
                <div className="placeholder-img"><Building2 size={64} /></div>
              )}
            </div>
            
            <div className="identity-info">
              {isEditing ? (
                <input 
                  className="edit-input title-input" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleChange} 
                />
              ) : (
                <h1>{profile.name}</h1>
              )}
              
              <span className="badge-type">{profile.type}</span>
              
              <div className="reg-id">
                <ShieldCheck size={14} /> 
                <span>Reg ID: {profile.regNumber}</span>
              </div>
            </div>

            <div className="stats-mini-grid">
              <div className="mini-stat">
                <span className="val">{profile.totalBeds}</span>
                <span className="lbl">Total Beds</span>
              </div>
              <div className="mini-stat">
                <span className="val">{profile.icuBeds}</span>
                <span className="lbl">ICU</span>
              </div>
              <div className="mini-stat">
                <span className="val">{profile.ambulances}</span>
                <span className="lbl">Ambulances</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details Forms */}
          <div className="details-column">
            
            {/* Contact Information */}
            <section className="glass-panel section-card">
              <div className="card-heading">
                <h3>Contact & Location</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label><Phone size={14}/> Phone</label>
                  {isEditing ? (
                    <input name="phone" value={profile.phone} onChange={handleChange} />
                  ) : (
                    <p>{profile.phone}</p>
                  )}
                </div>
                <div className="info-item">
                  <label><Mail size={14}/> Email</label>
                  {isEditing ? (
                    <input name="email" value={profile.email} onChange={handleChange} />
                  ) : (
                    <p>{profile.email}</p>
                  )}
                </div>
                <div className="info-item full">
                  <label><Globe size={14}/> Website</label>
                  {isEditing ? (
                    <input name="website" value={profile.website} onChange={handleChange} />
                  ) : (
                    <a href={`http://${profile.website}`} target="_blank" rel="noreferrer" className="link">{profile.website}</a>
                  )}
                </div>
                <div className="info-item full">
                  <label><MapPin size={14}/> Address</label>
                  {isEditing ? (
                    <textarea name="address" value={profile.address} onChange={handleChange} rows="2"/>
                  ) : (
                    <p>{profile.address}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>City</label>
                  {isEditing ? (
                    <input name="city" value={profile.city} onChange={handleChange} />
                  ) : (
                    <p>{profile.city}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Pincode</label>
                  {isEditing ? (
                    <input name="pincode" value={profile.pincode} onChange={handleChange} />
                  ) : (
                    <p>{profile.pincode}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Infrastructure Details */}
            <section className="glass-panel section-card">
              <div className="card-heading">
                <h3><BedDouble size={18}/> Infrastructure</h3>
              </div>
              <div className="info-grid three-col">
                <div className="info-item">
                  <label>Total Beds</label>
                  {isEditing ? (
                    <input type="number" name="totalBeds" value={profile.totalBeds} onChange={handleChange} />
                  ) : (
                    <p className="highlight-text">{profile.totalBeds}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>ICU Beds</label>
                  {isEditing ? (
                    <input type="number" name="icuBeds" value={profile.icuBeds} onChange={handleChange} />
                  ) : (
                    <p className="highlight-text">{profile.icuBeds}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Emergency Units</label>
                  {isEditing ? (
                    <input type="number" name="emergencyUnits" value={profile.emergencyUnits} onChange={handleChange} />
                  ) : (
                    <p className="highlight-text">{profile.emergencyUnits}</p>
                  )}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="glass-panel section-card">
              <div className="card-heading">
                <h3>About Hospital</h3>
              </div>
              <div className="info-item full">
                {isEditing ? (
                  <textarea 
                    name="description" 
                    value={profile.description} 
                    onChange={handleChange} 
                    rows="4" 
                    className="bio-edit"
                  />
                ) : (
                  <p className="description-text">{profile.description}</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}