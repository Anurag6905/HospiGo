import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AddLab.css'; // Make sure this exists from previous steps

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

  // --- HELPER: Create default schedule for new labs ---
  const generateDefaultSchedule = () => {
    const slots = [];
    // Default 7 AM to 10 PM
    for(let i=7; i<22; i++) slots.push(`${i.toString().padStart(2, '0')}:00`);
    
    const daySchema = { active: true, start: '07:00', end: '22:00', slots: slots };
    const dayOffSchema = { active: false, start: '00:00', end: '00:00', slots: [] };

    return {
        Mon: { ...daySchema },
        Tue: { ...daySchema },
        Wed: { ...daySchema },
        Thu: { ...daySchema },
        Fri: { ...daySchema },
        Sat: { ...daySchema },
        Sun: { ...daySchema, end: '14:00', slots: slots.slice(0, 7) } // Half day Sunday default
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create New Lab Object
    const newLab = {
        id: Date.now(),
        name: formData.testName,
        category: formData.category,
        price: formData.price,
        tat: formData.turnaround,
        home: formData.isHomeCollection,
        schedule: generateDefaultSchedule()
    };

    // 2. Simulate Delay & Save
    setTimeout(() => {
        const existingLabs = localStorage.getItem('hospital_labs');
        let labsList = existingLabs ? JSON.parse(existingLabs) : [];

        labsList.push(newLab);
        localStorage.setItem('hospital_labs', JSON.stringify(labsList));

        setLoading(false);
        alert('Lab Service Added Successfully!');
        navigate('/hospital/manage-labs'); // Redirect to manage page
    }, 1000);
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
              <input name="testName" type="text" placeholder="e.g. CBC" value={formData.testName} onChange={handleChange} required />
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
              <input name="price" type="number" placeholder="450" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Turnaround Time</label>
              <input name="turnaround" type="text" placeholder="e.g. 6-8 Hours" value={formData.turnaround} onChange={handleChange} required />
            </div>
            
            <div className="input-group checkbox-group">
               <label className="toggle-label">
                 <input type="checkbox" name="isHomeCollection" checked={formData.isHomeCollection} onChange={handleChange} />
                 <span className="toggle-text">Available for Home Collection</span>
               </label>
            </div>
          </div>

          <div className="input-group full">
            <label>Preparation / Instructions</label>
            <textarea name="instructions" rows="3" placeholder="e.g. 12 hours fasting required..." value={formData.instructions} onChange={handleChange} />
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