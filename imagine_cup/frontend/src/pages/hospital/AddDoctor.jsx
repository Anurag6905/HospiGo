import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AddDoctor.css'; 

export default function AddDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    setHospitalName(localStorage.getItem('hospital_name') || 'Your Hospital');
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

  // --- HELPER: Create default schedule for new doctors ---
  const generateDefaultSchedule = () => {
    // Generate default slots 9-5
    const slots = [];
    for(let i=9; i<17; i++) slots.push(`${i.toString().padStart(2, '0')}:00`);
    
    const daySchema = { active: true, start: '09:00', end: '17:00', slots: slots };
    const dayOffSchema = { active: false, start: '00:00', end: '00:00', slots: [] };

    return {
        Mon: { ...daySchema },
        Tue: { ...daySchema },
        Wed: { ...daySchema },
        Thu: { ...daySchema },
        Fri: { ...daySchema },
        Sat: { ...daySchema, end: '14:00', slots: slots.slice(0,5) }, // Half day
        Sun: { ...dayOffSchema }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create New Doctor Object
    const newDoctor = {
        id: Date.now(), // Unique ID based on timestamp
        name: formData.name,
        specialty: formData.specialization, // Mapping 'specialization' to 'specialty' for Manage page
        qual: formData.qualification,       // Mapping
        exp: formData.experience,           // Mapping
        fee: formData.fee,
        available: true, // Default active
        schedule: generateDefaultSchedule()
    };

    // 2. Simulate Network Delay
    setTimeout(() => {
        // 3. Get existing doctors from LocalStorage
        const existingDoctors = localStorage.getItem('hospital_doctors');
        let doctorsList = existingDoctors ? JSON.parse(existingDoctors) : [];

        // 4. Append new doctor
        doctorsList.push(newDoctor);

        // 5. Save back to LocalStorage
        localStorage.setItem('hospital_doctors', JSON.stringify(doctorsList));

        setLoading(false);
        alert('Doctor Added Successfully!');
        navigate('/hospital/manage-doctors'); // Redirect to the manage page to see the new entry
    }, 1000);
  };

  return (
    <div className="add-doctor-page">
      <div className="form-container">
        
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-btn" />
          <div className="header-content">
            <h1>Add New Doctor</h1>
            <p>Adding to <strong>{hospitalName}</strong></p>
          </div>
        </div>

        <form className="glass-form" onSubmit={handleSubmit}>
          
          <div className="image-section">
            <div className="image-wrapper">
              <div className="image-preview" style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}>
                {!preview && <span className="icon">👨‍⚕️</span>}
              </div>
              <label htmlFor="doc-img" className="upload-link">Upload Photo</label>
              <input id="doc-img" type="file" accept="image/*" onChange={handleImageChange} hidden />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group full">
              <label>Doctor Name</label>
              <input name="name" type="text" placeholder="Dr. Name" value={formData.name} onChange={handleChange} required />
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
              <input name="qualification" type="text" placeholder="MBBS, MD" value={formData.qualification} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Experience (Yrs)</label>
              <input name="experience" type="number" placeholder="e.g. 10" value={formData.experience} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Designation</label>
              <input name="designation" type="text" placeholder="Senior Consultant" value={formData.designation} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Consultation Fee (₹)</label>
              <input name="fee" type="number" placeholder="1000" value={formData.fee} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group full">
            <label>Bio / Description</label>
            <textarea name="bio" rows="3" placeholder="Short professional bio..." value={formData.bio} onChange={handleChange} />
          </div>

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