import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  Search, 
  ChevronLeft, 
  Stethoscope, 
  Activity, 
  BedDouble, 
  Calendar, 
  User, 
  LayoutDashboard, 
  Filter,
  Check,
  MapPin,
  Clock,
  MoreHorizontal,
  Plus,           
  FlaskConical,
  History    
} from 'lucide-react';
import '../../CSS/HospitalDashboard.css';

const HospitalDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [activeTab, setActiveTab] = useState('doctor');

  const [filters, setFilters] = useState({
    doctor: true,
    bed: true,
    lab: true
  });

  // 2. Initial Data (Your existing mock data, moved here)
  const initialData = [
    // ... paste your existing waitlistData array items here ...
  ];

  // 3. Active Waitlist State (Loads from storage if available)
  const [waitlist, setWaitlist] = useState(() => {
    const saved = localStorage.getItem('active_waitlist');
    return saved ? JSON.parse(saved) : initialData;
  });

  // 4. Save to Storage whenever list changes
  useEffect(() => {
    localStorage.setItem('active_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  // --- Handle Checkbox Clicks ---
  const handleFilterChange = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // --- Handle Approve/Reject ---
  const processRequest = (id, action) => {

    const item = waitlist.find(i => i.id === id);
    if (!item) return;

    const historyItem = { 
      ...item, 
      finalStatus: action === 'approve' ? 'Approved' : 'Rejected',
      processedAt: new Date().toLocaleString()
    };

    const existingHistory = JSON.parse(localStorage.getItem('request_history') || '[]');
    localStorage.setItem('request_history', JSON.stringify([historyItem, ...existingHistory]));

    setWaitlist(prev => prev.filter(i => i.id !== id));
  };

  const filteredData = waitlist.filter(item => {
    if (activeTab === 'doctor') return item.type === 'doctor';
    if (activeTab === 'beds') return item.type === 'bed';
    if (activeTab === 'lab') return item.type === 'lab';
    
    return true; 
  });

  // Mock data for the cards
  // const waitlistData = [
  //   {
  //     id: 1,
  //     type: 'Doctor Appointment',
  //     patientName: 'Rahul Mehta',
  //     procedure: 'Cardiology Review',
  //     location: 'Fortis Hiranandani - Cardiology OPD',
  //     time: 'Today - 4:30 PM – 4:50 PM',
  //     position: 3,
  //     total: 12,
  //     status: 'Pending',
  //     price: '₹1500',
  //     priceLabel: 'Consultation',
  //     reqTime: 'Requested 14 min ago',
  //     priority: 'warning' 
  //   },
  //   {
  //     id: 2,
  //     type: 'Doctor Appointment',
  //     patientName: 'Sanya Khan',
  //     procedure: 'Neurology Consultation',
  //     location: 'Fortis Hiranandani - Neurology OPD',
  //     time: 'Today - 5:00 PM – 5:20 PM',
  //     position: 4,
  //     total: 12,
  //     status: 'Urgent (Gold)',
  //     price: '₹1500',
  //     priceLabel: 'Consultation',
  //     reqTime: 'Requested 20 min ago',
  //     priority: 'gold'
  //   },
  //   {
  //     id: 3,
  //     type: 'Doctor Appointment',
  //     patientName: 'Vikram Singh',
  //     procedure: 'Orthopedic Review',
  //     location: 'Fortis Hiranandani - Ortho OPD',
  //     time: 'Today - 5:30 PM – 5:50 PM',
  //     position: 5,
  //     total: 12,
  //     status: 'Critical (Red)',
  //     price: '₹1500',
  //     priceLabel: 'Consultation',
  //     reqTime: 'Added by Emergency Desk',
  //     priority: 'danger'
  //   }
  // ];
  const counts = {
    all: waitlist.length,
    doctor: waitlist.filter(i => i.type === 'doctor').length,
    bed: waitlist.filter(i => i.type === 'bed').length,
    lab: waitlist.filter(i => i.type === 'lab').length
  };

  return (
    <div className="dashboard-container">
      {/* Background Blobs */}
      <div className="bg-blob blob-blue"></div>
      <div className="bg-blob blob-green"></div>

      {/* Top Navigation */}
      <nav className="glass-nav">
        <div className="nav-left">
          <div className="logo-section">
                <img src="/logo.png" alt="HospiGo" className="logo-circle" />
                <span className='logo-text'>Hospi<span>Go</span></span>
            </div>
        </div>
        <div className="nav-right">
          <button className="nav-pill active">Dashboard</button>
          <button className="nav-pill" onClick={() => navigate('/hospital/manage-doctors')}>Doctors</button>
          <button className="nav-pill" onClick={() => navigate('/hospital/manage-labs')}>Labs</button>
          <button className="nav-pill" onClick={() => navigate('/hospital/profile')}>Profile</button>
          <button className="nav-pill">Calendar</button>
        </div>
      </nav>

      <main className="main-content">
        {/* Header Section */}
        <header className="page-header glass-panel">
          <button className="back-btn glass-btn">
            <ChevronLeft size={24} color="#0f172a" />
          </button>
          <div className="header-titles">
            <h1>Active Waitlists</h1>
            <p>Manage beds, labs, and doctors in one place</p>
          </div>
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input-hospital" 
              placeholder="Search patient or booking ID..." 
            />
          </div>
        </header>

        {/* Category Tabs */}
        <div className="category-tabs-container">
            <div className="glass-tab-bar">
                {/* Optional: 'All' Tab to reset view */}
                <button 
                    className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All ({counts.all})
                </button>

                <button 
                    className={`tab-pill ${activeTab === 'beds' ? 'active' : ''}`}
                    onClick={() => setActiveTab('beds')}
                >
                    Beds ({counts.bed})
                </button>

                <button 
                    className={`tab-pill ${activeTab === 'lab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lab')}
                >
                    Lab ({counts.lab})
                </button>

                <button 
                    className={`tab-pill ${activeTab === 'doctor' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctor')}
                >
                    Doctor ({counts.doctor})
                </button>
            </div>
        </div>

        {/* Main Layout: Sidebar + List */}
        <div className="content-grid">
          
          {/* Left Sidebar Filter */}
          <aside className="sidebar glass-panel sticky">
            
            {/* --- NEW QUICK ACTIONS --- */}
            <div className="sidebar-actions">
                <h3 className="section-title">Quick Actions</h3>
                <button className="action-btn blue" onClick={() => navigate('/hospital/add-doctor')}>
                    <div className="icon-box"><Plus size={16} /></div>
                    <span>Add Doctor</span>
                </button>
                <button className="action-btn green" onClick={() => navigate('/hospital/add-lab')}>
                    <div className="icon-box"><FlaskConical size={16} /></div>
                    <span>Add Lab Service</span>
                </button>
                <button className="action-btn gold" onClick={() => navigate('/hospital/profile')}>
                    <div className="icon-box"><BedDouble size={16} /></div>
                    <span>Hospital Profile</span>
                </button>
                <button className="action-btn gold" onClick={() => navigate('/hospital/history')}>
                  <div className="icon-box"><History size={16} /></div>
                  <span>View History</span>
                </button>
            </div>

            <div className="sidebar-divider"></div>
            {/* ------------------------- */}

            <div className="sidebar-header">
              <Filter size={16} />
              <h3>Filters</h3>
            </div>

            <div className="filter-section">
                <h4>Priority</h4>
                <label className="checkbox-row">
                    <input type="checkbox" className="checkbox" />
                    <span>Normal</span>
                </label>
                <label className="checkbox-row">
                    <input  type="checkbox" className="checkbox" />
                    <span>Urgent (Gold)</span>
                </label>
                <label className="checkbox-row">
                    <input  type="checkbox" className="checkbox" />
                    <span>Critical (Red)</span>
                </label>
            </div>

            <div className="filter-section">
                <h4>Category</h4>
                
                {/* Update inputs to use state */}
                <label className="checkbox-row">
                    <input 
                        type="checkbox" 
                        checked={filters.bed} 
                        onChange={() => handleFilterChange('bed')} 
                    />
                    <span>IPD Bed</span>
                </label>
                
                <label className="checkbox-row">
                    <input 
                        type="checkbox" 
                        checked={filters.doctor} 
                        onChange={() => handleFilterChange('doctor')} 
                    />
                    <span>OPD Doctor</span>
                </label>
                
                <label className="checkbox-row">
                    <input 
                        type="checkbox" 
                        checked={filters.lab} 
                        onChange={() => handleFilterChange('lab')} 
                    />
                    <span>Lab Test</span>
                </label>
            </div>

            <div className="active-chips">
                <span className="chip">Pending</span>
                <span className="chip">Critical</span>
            </div>
          </aside>

          {/* Right Waitlist Cards */}
          <div className="waitlist-feed">
            {filteredData.length === 0 ? (
              <div className="empty-feed" style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
                <p>No active requests found for the selected filters.</p>
              </div>
            ) : (
              /* 2. Map through the filtered data */
              filteredData.map((item) => (
                <div key={item.id} className="waitlist-card glass-panel">
                  <div className="card-shine-border"></div>
                  
                  {/* Left Segment: Dynamic Icon based on Type */}
                  <div className="card-left">
                    <div className={`icon-tile ${item.type === 'lab' ? 'green' : item.type === 'bed' ? 'red' : 'blue'}`}>
                      {/* Show specific icon based on type */}
                      {item.type === 'doctor' && <Stethoscope size={32} color="white" />}
                      {item.type === 'bed' && <BedDouble size={32} color="white" />}
                      {item.type === 'lab' && <FlaskConical size={32} color="white" />}
                    </div>
                    <span className="category-label">{item.type.toUpperCase()}</span>
                  </div>

                  {/* Middle Segment: Info */}
                  <div className="card-mid">
                    <div className="patient-header">
                      {/* Note: Using item.title instead of patientName to be generic for labs/beds too */}
                      <h2>{item.title} <span className="light-text">– {item.subtitle}</span></h2>
                      
                      <span className={`status-pill ${item.priority}`}>
                        {item.priority === 'warning' && <span className="dot warning"></span>}
                        {item.priority === 'gold' && <span className="dot gold"></span>}
                        {item.priority === 'danger' && <span className="dot danger"></span>}
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="details-row">
                      <MapPin size={14} className="muted-icon"/>
                      <span>{item.location}</span>
                    </div>
                    <div className="details-row">
                      <Clock size={14} className="muted-icon"/>
                      <span className="time-text">{item.time}</span>
                    </div>
                  </div>

                  {/* Right Segment: Price & Actions */}
                  <div className="card-right">
                    <div className="price-info">
                      <span className="price-value">{item.price}</span>
                    </div>
                    <span className="req-time">{item.reqTime}</span>
                    
                    <div className="action-buttons">
                      {/* 3. Connect Buttons to the Process Function */}
                      <button 
                        className="btn-approve" 
                        onClick={() => processRequest(item.id, 'approve')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => processRequest(item.id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;