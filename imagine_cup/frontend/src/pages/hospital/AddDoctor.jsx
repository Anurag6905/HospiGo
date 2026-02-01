import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AddDoctor.css'; // New CSS file

export default function AddDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  // Get logged-in hospital name from storage
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('hospital_name') || 'Your Hospital';
    setHospitalName(storedName);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Cardiology',
    qualification: '',
    experience: '',
    designation: '',
    fee: '',
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

    // TODO: Integrate API call here using formData and hospital_id
    console.log("Submitting Doctor for:", hospitalName, formData);

    setTimeout(() => {
      setLoading(false);
      alert('Doctor Added Successfully!');
      navigate('/hospital/dashboard'); // Redirect back to dashboard
    }, 1500);
  };

  return (
    <div className="add-doctor-page">
      <div className="form-container">
        
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-content">
            <h1>Add New Doctor</h1>
            <p>Adding to <strong>{hospitalName}</strong></p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          {/* Image Upload */}
          <div className="image-section">
            <div className="image-wrapper">
              <div className="image-preview" style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}>
                {!preview && <span className="icon">👨‍⚕️</span>}
              </div>
              <label htmlFor="doc-img" className="upload-link">Upload Photo</label>
              <input id="doc-img" type="file" accept="image/*" onChange={handleImageChange} hidden />
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <div className="input-group full">
              <label>Doctor Name</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Dr. Name" 
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
                <option value="General">General Physician</option>
              </select>
            </div>

            <div className="input-group">
              <label>Qualification</label>
              <input 
                name="qualification" 
                type="text" 
                placeholder="MBBS, MD" 
                value={formData.qualification} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Experience (Yrs)</label>
              <input 
                name="experience" 
                type="number" 
                placeholder="e.g. 10" 
                value={formData.experience} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Designation</label>
              <input 
                name="designation" 
                type="text" 
                placeholder="Senior Consultant" 
                value={formData.designation} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Consultation Fee (₹)</label>
              <input 
                name="fee" 
                type="number" 
                placeholder="1000" 
                value={formData.fee} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="input-group full">
            <label>Bio / Description</label>
            <textarea 
              name="bio" 
              rows="3" 
              placeholder="Short professional bio..." 
              value={formData.bio} 
              onChange={handleChange} 
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}