import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/DoctorRegister.css';

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Cardiology',
    qualification: '',
    experience: '',
    designation: '',
    hospital: '',
    fee: '',
    city: 'Mumbai',
    bio: '',
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
      alert('Doctor Registered Successfully!');
      navigate('/user/services'); // Or wherever you want to redirect
    }, 1500);
  };

  return (
    <div className="doctor-register-page">
      <div className="doctor-register-container">
        
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-text">
            <h1>Add New Doctor</h1>
            <p>Enter professional details below</p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          {/* Section: Profile Image */}
          <div className="form-section image-section">
            <div className="image-upload-wrapper">
              <div className="image-preview" style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}>
                {!preview && <span className="placeholder-icon">📷</span>}
              </div>
              <label htmlFor="image-upload" className="upload-btn">
                {preview ? 'Change Photo' : 'Upload Photo'}
              </label>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                hidden 
              />
            </div>
          </div>

          {/* Section: Basic Info */}
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Doctor's Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="Dr. Rahul Mehta"
                value={formData.name} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Specialization</label>
              <select name="specialization" value={formData.specialization} onChange={handleChange}>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General">General Physician</option>
              </select>
            </div>

            <div className="input-group">
              <label>Qualification</label>
              <input 
                type="text" 
                name="qualification"
                placeholder="MBBS, MD"
                value={formData.qualification} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Experience (Years)</label>
              <input 
                type="number" 
                name="experience"
                placeholder="e.g. 12"
                value={formData.experience} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Designation</label>
              <input 
                type="text" 
                name="designation"
                placeholder="Senior Consultant"
                value={formData.designation} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Consultation Fee (₹)</label>
              <input 
                type="number" 
                name="fee"
                placeholder="1500"
                value={formData.fee} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Hospital/Clinic</label>
              <input 
                type="text" 
                name="hospital"
                placeholder="Apollo Hospital"
                value={formData.hospital} 
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Section: Bio */}
          <div className="input-group full-width bio-group">
            <label>Professional Bio</label>
            <textarea 
              name="bio"
              rows="4"
              placeholder="Brief description of expertise and achievements..."
              value={formData.bio} 
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Register Doctor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}