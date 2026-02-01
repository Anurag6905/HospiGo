import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/HospitalRegistration.css';

export default function HospitalRegisterDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    hospitalName: '',
    type: 'General', // General, Specialty, Multi-Specialty
    registrationNumber: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: 'Mumbai',
    pincode: '',
    totalBeds: '',
    icuBeds: '',
    emergencyUnits: '',
    ambulanceCount: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Hospital Details Saved Successfully!');
      navigate('/user/services'); 
    }, 1500);
  };

  return (
    <div className="hospital-details-page">
      <div className="hospital-register-container">
        
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-text">
            <h1>Register Hospital</h1>
            <p>Onboard a new healthcare facility</p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          {/* Section: Image Upload */}
          <div className="form-section image-section">
            <div className="image-upload-wrapper">
              <div className="image-preview" style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}>
                {!preview && <span className="placeholder-icon">🏥</span>}
              </div>
              <label htmlFor="hosp-image-upload" className="upload-btn">
                {preview ? 'Change Photo' : 'Upload Building Photo'}
              </label>
              <input 
                id="hosp-image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                hidden 
              />
            </div>
          </div>

          {/* Section: Basic Details */}
          <div className="section-title">
             <h3>Basic Information</h3>
          </div>
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Hospital Name</label>
              <input 
                type="text" 
                name="hospitalName"
                placeholder="e.g. City Care Multi-Specialty Hospital"
                value={formData.hospitalName} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Hospital Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="General">General Hospital</option>
                <option value="Multi-Specialty">Multi-Specialty</option>
                <option value="Specialty">Specialty Center</option>
                <option value="Clinic">Clinic / Nursing Home</option>
              </select>
            </div>

            <div className="input-group">
              <label>Registration Number</label>
              <input 
                type="text" 
                name="registrationNumber"
                placeholder="Govt. Reg. ID"
                value={formData.registrationNumber} 
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="section-title">
             <h3>Contact & Location</h3>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label>Official Phone</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Official Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="contact@hospital.com"
                value={formData.email} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group full-width">
              <label>Address</label>
              <textarea 
                name="address"
                rows="2"
                placeholder="Full street address..."
                value={formData.address} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Pincode</label>
              <input 
                type="text" 
                name="pincode"
                placeholder="400001"
                value={formData.pincode} 
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Section: Infrastructure */}
          <div className="section-title">
             <h3>Infrastructure & Capacity</h3>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label>Total Beds</label>
              <input 
                type="number" 
                name="totalBeds"
                placeholder="e.g. 150"
                value={formData.totalBeds} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>ICU Beds</label>
              <input 
                type="number" 
                name="icuBeds"
                placeholder="e.g. 20"
                value={formData.icuBeds} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Emergency Units</label>
              <input 
                type="number" 
                name="emergencyUnits"
                placeholder="e.g. 5"
                value={formData.emergencyUnits} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Ambulances</label>
              <input 
                type="number" 
                name="ambulanceCount"
                placeholder="e.g. 3"
                value={formData.ambulanceCount} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-btn hospital-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Register Hospital'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}