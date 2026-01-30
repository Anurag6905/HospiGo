import React, { useState } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import '../../CSS/HospitalDashboard.css';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctor');

  // Mock data for the cards
  const waitlistData = [
    {
      id: 1,
      type: 'Doctor Appointment',
      patientName: 'Rahul Mehta',
      procedure: 'Cardiology Review',
      location: 'Fortis Hiranandani - Cardiology OPD',
      time: 'Today - 4:30 PM – 4:50 PM',
      position: 3,
      total: 12,
      status: 'Pending',
      price: '₹1500',
      priceLabel: 'Consultation',
      reqTime: 'Requested 14 min ago',
      priority: 'warning' // used for status color logic
    },
    {
      id: 2,
      type: 'Doctor Appointment',
      patientName: 'Sanya Khan',
      procedure: 'Neurology Consultation',
      location: 'Fortis Hiranandani - Neurology OPD',
      time: 'Today - 5:00 PM – 5:20 PM',
      position: 4,
      total: 12,
      status: 'Urgent (Gold)',
      price: '₹1500',
      priceLabel: 'Consultation',
      reqTime: 'Requested 20 min ago',
      priority: 'gold'
    },
    {
      id: 3,
      type: 'Doctor Appointment',
      patientName: 'Vikram Singh',
      procedure: 'Orthopedic Review',
      location: 'Fortis Hiranandani - Ortho OPD',
      time: 'Today - 5:30 PM – 5:50 PM',
      position: 5,
      total: 12,
      status: 'Critical (Red)',
      price: '₹1500',
      priceLabel: 'Consultation',
      reqTime: 'Added by Emergency Desk',
      priority: 'danger'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Background Blobs */}
      <div className="bg-blob blob-blue"></div>
      <div className="bg-blob blob-green"></div>

      {/* Top Navigation */}
      <nav className="glass-nav">
        <div className="nav-left">
          <div className="logo-icon">
            <div className="cross-bar vertical"></div>
            <div className="cross-bar horizontal"></div>
          </div>
          <span className="logo-text">HospiGo</span>
        </div>
        <div className="nav-right">
          <button className="nav-pill active">Dashboard</button>
          <button className="nav-pill">Appointments</button>
          <button className="nav-pill">Labs</button>
          <button className="nav-pill">Profile</button>
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
              className="search-input" 
              placeholder="Search patient or booking ID..." 
            />
          </div>
        </header>

        {/* Category Tabs */}
        <div className="category-tabs-container">
            {/* Handwritten Label */}
            <div className="handwritten-label">
                <span>Active</span>
                <svg className="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 14 12 12 22M12 22L8 16M12 22L16 16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
            <div className="glass-tab-bar">
                <button 
                    className={`tab-pill ${activeTab === 'beds' ? 'active' : ''}`}
                    onClick={() => setActiveTab('beds')}
                >
                    Beds (23)
                </button>
                <button 
                    className={`tab-pill ${activeTab === 'lab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lab')}
                >
                    Lab (5)
                </button>
                <button 
                    className={`tab-pill ${activeTab === 'doctor' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctor')}
                >
                    Doctor (23)
                </button>
            </div>
        </div>

        {/* Main Layout: Sidebar + List */}
        <div className="content-grid">
          
          {/* Left Sidebar Filter */}
          <aside className="sidebar glass-panel sticky">
            <div className="sidebar-header">
              <Filter size={16} />
              <h3>Filters</h3>
            </div>

            <div className="filter-section">
                <h4>Status</h4>
                <label className="checkbox-row active-row">
                    <div className="checkbox checked"><Check size={12} color="white"/></div>
                    <span>Pending</span>
                </label>
                <label className="checkbox-row">
                    <div className="checkbox"></div>
                    <span>Approved</span>
                </label>
                <label className="checkbox-row">
                    <div className="checkbox"></div>
                    <span>Cancelled</span>
                </label>
            </div>

            <div className="filter-section">
                <h4>Priority</h4>
                <label className="checkbox-row">
                    <div className="checkbox"></div>
                    <span>Normal</span>
                </label>
                <label className="checkbox-row">
                    <div className="checkbox checked-gold"><Check size={12} color="white"/></div>
                    <span>Urgent (Gold)</span>
                </label>
                <label className="checkbox-row active-row-red">
                    <div className="checkbox checked-red"><Check size={12} color="white"/></div>
                    <span>Critical (Red)</span>
                </label>
            </div>

            <div className="filter-section">
                <h4>Type</h4>
                <label className="checkbox-row">
                    <div className="checkbox checked-green"><Check size={12} color="white"/></div>
                    <span>IPD Bed</span>
                </label>
                <label className="checkbox-row active-row-green">
                    <div className="checkbox checked-green"><Check size={12} color="white"/></div>
                    <span>OPD Doctor</span>
                </label>
                <label className="checkbox-row">
                    <div className="checkbox"></div>
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
            {waitlistData.map((item) => (
              <div key={item.id} className="waitlist-card glass-panel">
                <div className="card-shine-border"></div>
                
                {/* Left Segment */}
                <div className="card-left">
                    <div className="icon-tile">
                        <Stethoscope size={32} color="white" />
                    </div>
                    <span className="category-label">{item.type}</span>
                </div>

                {/* Middle Segment */}
                <div className="card-mid">
                    <div className="patient-header">
                        <h2>{item.patientName} <span className="light-text">– {item.procedure}</span></h2>
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
                    <div className="details-row">
                        <Activity size={14} className="muted-icon"/>
                        <span className="queue-text">Position in waitlist: <b>#{item.position}</b> of {item.total}</span>
                    </div>
                </div>

                {/* Right Segment */}
                <div className="card-right">
                    <div className="price-info">
                        <span className="price-label">{item.priceLabel}: </span>
                        <span className="price-value">{item.price}</span>
                    </div>
                    <span className="req-time">{item.reqTime}</span>
                    
                    <div className="action-buttons">
                        <button className="btn-approve">Approve</button>
                        <button className="btn-reject">Reject</button>
                    </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;