import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ChevronLeft, Save, Calendar, FlaskConical, 
  Tag, Trash2, Plus, CheckCircle, XCircle 
} from 'lucide-react';
import '../../CSS/ManageResources.css';

export default function ManageLabs() {
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

  // --- INITIAL MOCK DATA ---
  const initialMockData = [
    { 
      id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood', price: 450, 
      tat: '6 Hrs', home: true,
      schedule: { 
        Mon: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Tue: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Wed: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Thu: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Fri: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Sat: { active: true, start: '07:00', end: '22:00', slots: generateSlotsFromRange('07:00', '22:00') },
        Sun: { active: true, start: '08:00', end: '14:00', slots: generateSlotsFromRange('08:00', '14:00') }
      }
    }
  ];

  // --- STATE WITH LOCAL STORAGE ---
  const [labs, setLabs] = useState(() => {
    const saved = localStorage.getItem('hospital_labs');
    return saved ? JSON.parse(saved) : initialMockData;
  });

  const [selectedId, setSelectedId] = useState(labs[0]?.id || null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hospital_labs', JSON.stringify(labs));
  }, [labs]);

  const selectedLab = labs.find(l => l.id === selectedId) || labs[0];
  const currentSchedule = selectedLab ? selectedLab.schedule[selectedDay] : null;

  // --- HANDLERS: DETAILS ---

  const handleDetailChange = (field, value) => {
    setLabs(prev => prev.map(lab => 
      lab.id === selectedId ? { ...lab, [field]: value } : lab
    ));
  };

  const handleDelete = () => {
    const confirm = window.confirm(`Delete ${selectedLab.name}?`);
    if (confirm) {
      const remaining = labs.filter(l => l.id !== selectedId);
      setLabs(remaining);
      if (remaining.length > 0) setSelectedId(remaining[0].id);
      else setSelectedId(null);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    alert(`Details updated for ${selectedLab.name}`);
  };

  // --- HANDLERS: SCHEDULE ---

  const toggleDayAvailability = () => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === selectedId) {
        const isActive = !lab.schedule[selectedDay].active;
        return {
          ...lab,
          schedule: {
            ...lab.schedule,
            [selectedDay]: {
              ...lab.schedule[selectedDay],
              active: isActive,
              slots: isActive 
                ? generateSlotsFromRange(lab.schedule[selectedDay].start, lab.schedule[selectedDay].end)
                : []
            }
          }
        };
      }
      return lab;
    }));
  };

  const handleRangeChange = (field, value) => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === selectedId) {
        const daySchedule = lab.schedule[selectedDay];
        const newStart = field === 'start' ? value : daySchedule.start;
        const newEnd = field === 'end' ? value : daySchedule.end;
        return {
          ...lab,
          schedule: {
            ...lab.schedule,
            [selectedDay]: {
              ...daySchedule,
              [field]: value,
              slots: generateSlotsFromRange(newStart, newEnd)
            }
          }
        };
      }
      return lab;
    }));
  };

  const toggleIndividualSlot = (timeSlot) => {
    setLabs(prev => prev.map(lab => {
      if (lab.id === selectedId) {
        const currentSlots = lab.schedule[selectedDay].slots;
        let newSlots;
        if (currentSlots.includes(timeSlot)) {
          newSlots = currentSlots.filter(s => s !== timeSlot);
        } else {
          newSlots = [...currentSlots, timeSlot].sort();
        }
        return {
          ...lab,
          schedule: {
            ...lab.schedule,
            [selectedDay]: { ...lab.schedule[selectedDay], slots: newSlots }
          }
        };
      }
      return lab;
    }));
  };

  const handleSaveSchedule = () => {
    alert(`Schedule updated for ${selectedLab.name}`);
  };

  // Grid for Lab Hours (7 AM - 10 PM)
  const fullDayGrid = [];
  for (let i = 7; i <= 22; i++) {
    fullDayGrid.push(`${i.toString().padStart(2, '0')}:00`);
  }

  if (!selectedLab) return (
    <div className="manage-page">
      <div className="manage-container">
        <div className="manage-page-header">
            <div className="header-titles"><h1>Manage Lab Tests</h1></div>
            <button className="add-new-btn green" onClick={() => navigate('/hospital/add-lab')}><Plus size={18} /> Add Test</button>
        </div>
        <div className="empty-state" style={{textAlign:'center', padding: '50px'}}>
            <h3>No lab tests found. Add one to get started.</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="manage-page">
      <div className="manage-container">
        
        {/* Header */}
        <div className="manage-page-header">
          <div className="header-left">
            <button onClick={() => navigate('/hospital/dashboard')} className="back-btn">
              <ChevronLeft size={24} />
            </button>
            <div className="header-titles">
              <h1>Manage Lab Tests</h1>
              <p>Update pricing and testing hours</p>
            </div>
          </div>
          <button className="add-new-btn green" onClick={() => navigate('/hospital/add-lab')}>
            <Plus size={18} /> Add New Test
          </button>
        </div>

        <div className="master-detail-grid">
          
          {/* Left Sidebar */}
          <div className="list-sidebar glass-panel">
            <div className="search-bar-manage">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search tests..." />
            </div>
            <div className="items-list">
              {labs.map(lab => (
                <div 
                  key={lab.id} 
                  className={`list-item ${selectedId === lab.id ? 'active green' : ''}`}
                  onClick={() => { setSelectedId(lab.id); setActiveTab('details'); }}
                >
                  <div className="item-avatar green">
                    <FlaskConical size={20} />
                  </div>
                  <div className="item-info">
                    <h4>{lab.name}</h4>
                    <p>{lab.category}</p>
                  </div>
                  <span className="price-tag">₹{lab.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="detail-panel glass-panel">
            <div className="detail-header">
              <div className="detail-profile">
                <div className="large-avatar green">🔬</div>
                <div>
                  <h2>{selectedLab.name}</h2>
                  <span className="badge green">{selectedLab.category}</span>
                </div>
              </div>
              <div className="tabs">
                <button 
                  className={`tab-btn ${activeTab === 'details' ? 'active green' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <Tag size={16} /> Details
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'schedule' ? 'active green' : ''}`}
                  onClick={() => setActiveTab('schedule')}
                >
                  <Calendar size={16} /> Hours
                </button>
              </div>
            </div>

            <div className="detail-content">
              
              {/* DETAILS TAB */}
              {activeTab === 'details' ? (
                <form className="edit-form" onSubmit={handleSaveDetails}>
                  <div className="input-group">
                    <label>Test Name</label>
                    <input 
                        type="text" 
                        value={selectedLab.name} 
                        onChange={(e) => handleDetailChange('name', e.target.value)} 
                    />
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Price (₹)</label>
                      <input 
                        type="number" 
                        value={selectedLab.price} 
                        onChange={(e) => handleDetailChange('price', e.target.value)} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Turnaround Time</label>
                      <input 
                        type="text" 
                        value={selectedLab.tat} 
                        onChange={(e) => handleDetailChange('tat', e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Home Collection</label>
                    <select 
                        value={selectedLab.home ? 'Yes' : 'No'}
                        onChange={(e) => handleDetailChange('home', e.target.value === 'Yes')}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div className="form-footer">
                    <button type="button" className="btn-delete" onClick={handleDelete}>
                        <Trash2 size={18}/> Delete
                    </button>
                    <button type="submit" className="btn-save green">
                        <Save size={18}/> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* SCHEDULE TAB */
                <div className="visual-calendar">
                  
                  {/* Day Selector */}
                  <div className="days-row-visual">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button 
                        key={day}
                        className={`day-pill ${selectedDay === day ? 'selected' : ''} ${selectedLab.schedule[day].active ? 'active-dot' : ''}`}
                        onClick={() => setSelectedDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Day Editor */}
                  <div className="day-editor-card">
                    <div className="editor-header">
                        <h3>Edit Schedule for <span className="highlight-day">{selectedDay}day</span></h3>
                        <label className="toggle-label">
                            <span>Lab Open</span>
                            <div className="toggle-switch green-toggle">
                                <input type="checkbox" checked={currentSchedule.active} onChange={toggleDayAvailability} />
                                <span className="slider"></span>
                            </div>
                        </label>
                    </div>

                    {currentSchedule.active ? (
                        <>
                            <div className="time-range-inputs">
                                <div className="input-group">
                                    <label>Opening Time</label>
                                    <input 
                                      type="time" 
                                      value={currentSchedule.start} 
                                      onChange={(e) => handleRangeChange('start', e.target.value)} 
                                    />
                                </div>
                                <span className="separator">to</span>
                                <div className="input-group">
                                    <label>Closing Time</label>
                                    <input 
                                      type="time" 
                                      value={currentSchedule.end} 
                                      onChange={(e) => handleRangeChange('end', e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className="slots-preview">
                                <h4>Manage Slots (Click to Toggle)</h4>
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
                            <div className="off-icon">🔒</div>
                            <p>Lab is closed on {selectedDay}s</p>
                            <button className="text-btn" onClick={toggleDayAvailability}>Open Lab</button>
                        </div>
                    )}
                  </div>

                  <div className="form-footer">
                    <button className="btn-save green full" onClick={handleSaveSchedule}>
                      <Save size={18}/> Update Lab Hours
                    </button>
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