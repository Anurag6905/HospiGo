import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AddLab.css'; // Distinct styling for Labs

export default function AddLabService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    setHospitalName(localStorage.getItem('hospital_name') || 'Your Hospital');
  }, []);

  const [formData, setFormData] = useState({
    testName: '',
    category: 'Blood',
    price: '',
    turnaround: '',
    isHomeCollection: false,
    instructions: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrate API call here
    console.log("Adding Lab Test for:", hospitalName, formData);

    setTimeout(() => {
      setLoading(false);
      alert('Lab Service Added Successfully!');
      navigate('/hospital/dashboard');
    }, 1500);
  };

  return (
    <div className="add-lab-page">
      <div className="form-container">
        
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-content">
            <h1>Add Lab Service</h1>
            <p>New test for <strong>{hospitalName}</strong></p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          <div className="icon-header">
            <span className="big-icon">🔬</span>
          </div>

          <div className="form-grid">
            <div className="input-group full">
              <label>Test Name</label>
              <input 
                name="testName" 
                type="text" 
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
                <option value="Imaging">X-Ray / MRI</option>
                <option value="Pathology">Pathology</option>
              </select>
            </div>

            <div className="input-group">
              <label>Price (₹)</label>
              <input 
                name="price" 
                type="number" 
                placeholder="450" 
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Turnaround Time</label>
              <input 
                name="turnaround" 
                type="text" 
                placeholder="e.g. 6-8 Hours" 
                value={formData.turnaround} 
                onChange={handleChange} 
                required 
              />
            </div>
            
             {/* Checkbox Toggle */}
            <div className="input-group checkbox-group">
               <label className="toggle-label">
                 <input 
                    type="checkbox" 
                    name="isHomeCollection" 
                    checked={formData.isHomeCollection} 
                    onChange={handleChange} 
                  />
                 <span className="toggle-text">Available for Home Collection</span>
               </label>
            </div>
          </div>

          <div className="input-group full">
            <label>Preparation / Instructions</label>
            <textarea 
              name="instructions" 
              rows="3" 
              placeholder="e.g. 12 hours fasting required..." 
              value={formData.instructions} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-btn lab-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Add Service'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}