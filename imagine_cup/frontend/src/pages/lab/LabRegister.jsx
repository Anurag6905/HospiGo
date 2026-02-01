import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/LabRegister.css';

export default function LabRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    labName: '',
    testName: '',
    category: 'Blood',
    price: '',
    turnaroundTime: '', // e.g. "6-12 hours"
    sampleType: '', // e.g. "Blood", "Urine", "None"
    accreditation: '', // e.g. NABL
    preparation: '', // e.g. "Fasting required"
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
      alert('Lab Test Registered Successfully!');
      navigate('/user/services'); 
    }, 1500);
  };

  return (
    <div className="lab-register-page">
      <div className="lab-register-container">
        
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-text">
            <h1>Add Lab Service</h1>
            <p>Register a diagnostic test or facility</p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          {/* Section: Image Upload */}
          <div className="form-section image-section">
            <div className="image-upload-wrapper">
              <div className="image-preview" style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}>
                {!preview && <span className="placeholder-icon">🔬</span>}
              </div>
              <label htmlFor="lab-image-upload" className="upload-btn">
                {preview ? 'Change Image' : 'Upload Image'}
              </label>
              <input 
                id="lab-image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                hidden 
              />
            </div>
          </div>

          {/* Section: Details */}
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Lab / Hospital Name</label>
              <input 
                type="text" 
                name="labName"
                placeholder="e.g. Apollo Diagnostics"
                value={formData.labName} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Test Name</label>
              <input 
                type="text" 
                name="testName"
                placeholder="e.g. CBC, Lipid Profile"
                value={formData.testName} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Blood">Blood Test</option>
                <option value="Urine">Urine Analysis</option>
                <option value="Imaging">Imaging (X-Ray/MRI)</option>
                <option value="Pathology">Pathology</option>
                <option value="Microbiology">Microbiology</option>
              </select>
            </div>

            <div className="input-group">
              <label>Price (₹)</label>
              <input 
                type="number" 
                name="price"
                placeholder="450"
                value={formData.price} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Turnaround Time</label>
              <input 
                type="text" 
                name="turnaroundTime"
                placeholder="e.g. 6-12 Hours"
                value={formData.turnaroundTime} 
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Sample Type</label>
              <input 
                type="text" 
                name="sampleType"
                placeholder="e.g. Blood Serum"
                value={formData.sampleType} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Accreditation (Optional)</label>
              <input 
                type="text" 
                name="accreditation"
                placeholder="e.g. NABL / CAP"
                value={formData.accreditation} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Section: Preparation/Description */}
          <div className="input-group full-width">
            <label>Patient Preparation / Instructions</label>
            <textarea 
              name="preparation"
              rows="3"
              placeholder="e.g. 12 hours fasting required. Do not take medication before test."
              value={formData.preparation} 
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-btn lab-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Register Lab Service'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}