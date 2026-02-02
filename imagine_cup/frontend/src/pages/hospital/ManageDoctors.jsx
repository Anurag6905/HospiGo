import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ChevronLeft, Save, Calendar, User, 
  Trash2, Plus, Stethoscope, CheckCircle, XCircle 
} from 'lucide-react';
import '../../CSS/ManageResources.css';

export default function ManageDoctors() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedDay, setSelectedDay] = useState('Mon');

  // --- HELPER: Generate slots ---
  const generateSlotsFromRange = (start, end) => {
    const slots = [];
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // --- INITIAL MOCK DATA (Fallback) ---
  const initialMockData = [
    { 
      id: 1, name: 'Dr. Rahul Mehta', specialty: 'Cardiology', fee: 1500, 
      exp: '12', qual: 'MBBS, MD', available: true,
      schedule: { 
        Mon: { active: true, start: '09:00', end: '17:00', slots: generateSlotsFromRange('09:00', '17:00') },
        Tue: { active: true, start: '09:00', end: '17:00', slots: generateSlotsFromRange('09:00', '17:00') },
        Wed: { active: false, start: '09:00', end: '17:00', slots: [] },
        Thu: { active: true, start: '10:00', end: '18:00', slots: generateSlotsFromRange('10:00', '18:00') },
        Fri: { active: true, start: '09:00', end: '14:00', slots: generateSlotsFromRange('09:00', '14:00') },
        Sat: { active: true, start: '10:00', end: '14:00', slots: generateSlotsFromRange('10:00', '14:00') },
        Sun: { active: false, start: '00:00', end: '00:00', slots: [] }
      }
    }
  ];

  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('hospital_doctors');
    return saved ? JSON.parse(saved) : initialMockData;
  });

  const [selectedId, setSelectedId] = useState(doctors[0]?.id || null);

  // Sync to LocalStorage whenever doctors state changes
  useEffect(() => {
    localStorage.setItem('hospital_doctors', JSON.stringify(doctors));
  }, [doctors]);

  // Derived state
  const selectedDoctor = doctors.find(d => d.id === selectedId) || doctors[0];
  // Safety check in case no doctors exist
  const currentSchedule = selectedDoctor ? selectedDoctor.schedule[selectedDay] : null;

  // --- HANDLERS ---

  const handleDetailChange = (field, value) => {
    setDoctors(prev => prev.map(doc => 
      doc.id === selectedId ? { ...doc, [field]: value } : doc
    ));
  };

  const handleDelete = () => {
    const confirm = window.confirm(`Are you sure you want to delete ${selectedDoctor.name}?`);
    if (confirm) {
      const remaining = doctors.filter(d => d.id !== selectedId);
      setDoctors(remaining);
      // Select the next available doctor or null
      if (remaining.length > 0) setSelectedId(remaining[0].id);
      else setSelectedId(null);
    }
  };

  const toggleDayAvailability = () => {
    setDoctors(prev => prev.map(doc => {
      if (doc.id === selectedId) {
        const isActive = !doc.schedule[selectedDay].active;
        return {
          ...doc,
          schedule: {
            ...doc.schedule,
            [selectedDay]: {
              ...doc.schedule[selectedDay],
              active: isActive,
              slots: isActive 
                ? generateSlotsFromRange(doc.schedule[selectedDay].start, doc.schedule[selectedDay].end) 
                : []
            }
          }
        };
      }
      return doc;
    }));
  };

  const handleRangeChange = (field, value) => {
    setDoctors(prev => prev.map(doc => {
      if (doc.id === selectedId) {
        const daySchedule = doc.schedule[selectedDay];
        const newStart = field === 'start' ? value : daySchedule.start;
        const newEnd = field === 'end' ? value : daySchedule.end;
        return {
          ...doc,
          schedule: {
            ...doc.schedule,
            [selectedDay]: {
              ...daySchedule,
              [field]: value,
              slots: generateSlotsFromRange(newStart, newEnd)
            }
          }
        };
      }
      return doc;
    }));
  };

  const toggleIndividualSlot = (timeSlot) => {
    setDoctors(prev => prev.map(doc => {
      if (doc.id === selectedId) {
        const currentSlots = doc.schedule[selectedDay].slots;
        let newSlots;
        if (currentSlots.includes(timeSlot)) {
          newSlots = currentSlots.filter(s => s !== timeSlot);
        } else {
          newSlots = [...currentSlots, timeSlot].sort();
        }
        return {
          ...doc,
          schedule: {
            ...doc.schedule,
            [selectedDay]: { ...doc.schedule[selectedDay], slots: newSlots }
          }
        };
      }
      return doc;
    }));
  };

  // Grid for rendering
  const fullDayGrid = [];
  for (let i = 8; i <= 20; i++) {
    fullDayGrid.push(`${i.toString().padStart(2, '0')}:00`);
  }

  if (!selectedDoctor) return (
    <div className="manage-page">
      <div className="manage-container">
        <div className="manage-page-header">
            <div className="header-titles"><h1>Manage Doctors</h1></div>
            <button className="add-new-btn" onClick={() => navigate('/hospital/add-doctor')}><Plus size={18} /> Add Doctor</button>
        </div>
        <div className="empty-state" style={{textAlign:'center', padding: '50px'}}>
            <h3>No doctors found. Add one to get started.</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="manage-page">
      <div className="manage-container">
        
        {/* Page Header */}
        <div className="manage-page-header">
          <div className="header-left">
            <button onClick={() => navigate('/hospital/dashboard')} className="back-btn">
              <ChevronLeft size={24} />
            </button>
            <div className="header-titles">
              <h1>Manage Doctors</h1>
              <p>Edit profiles and configure weekly availability</p>
            </div>
          </div>
          <button className="add-new-btn" onClick={() => navigate('/hospital/add-doctor')}>
            <Plus size={18} /> Add New Doctor
          </button>
        </div>

        <div className="master-detail-grid">
          
          {/* Left Sidebar: List */}
          <div className="list-sidebar glass-panel">
            <div className="search-bar-manage">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search doctors..." />
            </div>
            <div className="items-list">
              {doctors.map(doc => (
                <div 
                  key={doc.id} 
                  className={`list-item ${selectedId === doc.id ? 'active' : ''}`}
                  onClick={() => { setSelectedId(doc.id); setActiveTab('details'); }}
                >
                  <div className="item-avatar">
                    <Stethoscope size={20} />
                  </div>
                  <div className="item-info">
                    <h4>{doc.name}</h4>
                    <p>{doc.specialty}</p>
                  </div>
                  <div className={`status-dot ${doc.available ? 'online' : 'offline'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Details & Calendar */}
          <div className="detail-panel glass-panel">
            
            <div className="detail-header">
              <div className="detail-profile">
                <div className="large-avatar">👨‍⚕️</div>
                <div>
                  <h2>{selectedDoctor.name}</h2>
                  <span className="badge">{selectedDoctor.specialty}</span>
                </div>
              </div>
              <div className="tabs">
                <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                  <User size={16} /> Details
                </button>
                <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                  <Calendar size={16} /> Schedule
                </button>
              </div>
            </div>

            <div className="detail-content">
              
              {/* DETAILS TAB */}
              {activeTab === 'details' ? (
                <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input type="text" value={selectedDoctor.name} onChange={(e) => handleDetailChange('name', e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Qualification</label>
                      <input type="text" value={selectedDoctor.qual} onChange={(e) => handleDetailChange('qual', e.target.value)} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Experience</label>
                      <input type="text" value={selectedDoctor.exp} onChange={(e) => handleDetailChange('exp', e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Consultation Fee (₹)</label>
                      <input type="number" value={selectedDoctor.fee} onChange={(e) => handleDetailChange('fee', e.target.value)} />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Availability Status</label>
                    <select value={selectedDoctor.available ? 'Active' : 'On Leave'} onChange={(e) => handleDetailChange('available', e.target.value === 'Active')}>
                      <option value="Active">Active (Accepting Bookings)</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  
                  <div className="form-footer">
                    <button type="button" className="btn-delete" onClick={handleDelete}><Trash2 size={18}/> Delete</button>
                    <button className="btn-save" onClick={() => alert('Saved!')}><Save size={18}/> Save Changes</button>
                  </div>
                </form>
              ) : (
                /* SCHEDULE TAB */
                <div className="visual-calendar">
                  <div className="days-row-visual">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button 
                        key={day}
                        className={`day-pill ${selectedDay === day ? 'selected' : ''} ${selectedDoctor.schedule[day].active ? 'active-dot' : ''}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="day-editor-card">
                    <div className="editor-header">
                        <h3>Edit Schedule for <span className="highlight-day">{selectedDay}day</span></h3>
                        <label className="toggle-label">
                            <span>Available</span>
                            <div className="toggle-switch">
                                <input type="checkbox" checked={currentSchedule.active} onChange={toggleDayAvailability} />
                                <span className="slider"></span>
                            </div>
                        </label>
                    </div>

                    {currentSchedule.active ? (
                        <>
                            <div className="time-range-inputs">
                                <div className="input-group">
                                    <label>Quick Set Start</label>
                                    <input type="time" value={currentSchedule.start} onChange={(e) => handleRangeChange('start', e.target.value)} />
                                </div>
                                <span className="separator">to</span>
                                <div className="input-group">
                                    <label>Quick Set End</label>
                                    <input type="time" value={currentSchedule.end} onChange={(e) => handleRangeChange('end', e.target.value)} />
                                </div>
                            </div>

                            <div className="slots-preview">
                                <h4>Manage Individual Slots (Click to Toggle)</h4>
                                <div className="slots-grid">
                                    {fullDayGrid.map((time) => {
                                        const isActive = currentSchedule.slots.includes(time);
                                        return (
                                            <button 
                                                key={time} 
                                                type="button"
                                                className={`preview-slot ${isActive ? 'open' : 'closed clickable'}`}
                                                onClick={() => toggleIndividualSlot(time)}
                                            >
                                                {time}
                                                {isActive ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="day-off-state">
                            <div className="off-icon">😴</div>
                            <p>Doctor is not available on {selectedDay}s</p>
                            <button className="text-btn" onClick={toggleDayAvailability}>Turn On</button>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}