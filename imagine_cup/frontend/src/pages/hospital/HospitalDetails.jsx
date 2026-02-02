import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Star, Search, Filter, Stethoscope, 
  FlaskConical, BedDouble, Calendar, Clock, CheckCircle, ArrowRight
} from 'lucide-react';
import '../../CSS/HospitalDetails.css';

export default function HospitalDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors'); // doctors | labs | facilities
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // --- Data States ---
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    // Syncing with your existing LocalStorage keys
    const storedDocs = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    const storedLabs = JSON.parse(localStorage.getItem('hospital_labs') || '[]');
    setDoctors(storedDocs);
    setLabs(storedLabs);
  }, []);

  // --- Search & Sort Logic ---
  const filteredData = useMemo(() => {
    let list = activeTab === 'doctors' ? doctors : labs;
    
    if (searchQuery) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.specialty && item.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (sortBy === 'fee-low') list = [...list].sort((a, b) => a.fee - b.fee);
    if (sortBy === 'exp') list = [...list].sort((a, b) => b.experience - a.experience);

    return list;
  }, [activeTab, doctors, labs, searchQuery, sortBy]);

  const handleBooking = (item) => {
    // This connects to your Dashboard's 'active_waitlist' key
    const newRequest = {
      id: Date.now(),
      type: activeTab === 'doctors' ? 'doctor' : activeTab === 'labs' ? 'lab' : 'bed',
      title: item.name,
      subtitle: item.specialty || item.category,
      location: "Main Branch - OPD",
      time: "Requested for Today",
      price: `₹${item.fee || item.price}`,
      status: 'Pending',
      priority: 'warning',
      reqTime: 'Just now'
    };

    const currentWaitlist = JSON.parse(localStorage.getItem('active_waitlist') || '[]');
    localStorage.setItem('active_waitlist', JSON.stringify([newRequest, ...currentWaitlist]));
    alert(`Booking request sent for ${item.name}! Check the Admin Dashboard.`);
  };

  return (
    <div className="details-page-wrapper">
      {/* Background Blobs for Brand Consistency */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="details-container">
        {/* Navigation Bar */}
        <header className="details-nav glass-panel">
          <button onClick={() => navigate(-1)} className="back-circle">
            <ChevronLeft size={20} />
          </button>
          <div className="hospital-brand">
            <h1>City General Hospital</h1>
            <div className="meta-row">
              <span className="rating-pill"><Star size={12} fill="currentColor" /> 4.8</span>
              <span className="location-text"><MapPin size={12} /> Andheri West, Mumbai</span>
            </div>
          </div>
        </header>

        {/* Search & Category Section */}
        <section className="controls-box glass-panel">

          <div className="filter-row">
            <div className="search-pill">
              <Search size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="sort-select" onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Recommended</option>
              <option value="fee-low">Price: Low to High</option>
              <option value="exp">Experience: High to Low</option>
            </select>
          </div>

          <div className="tabs-row">
            <button className={`tab-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
              <Stethoscope size={18} /> Doctors
            </button>
            <button className={`tab-item ${activeTab === 'labs' ? 'active' : ''}`} onClick={() => setActiveTab('labs')}>
              <FlaskConical size={18} /> Labs
            </button>
            <button className={`tab-item ${activeTab === 'facilities' ? 'active' : ''}`} onClick={() => setActiveTab('facilities')}>
              <BedDouble size={18} /> Facilities
            </button>
          </div>
        </section>

        {/* Content Grid */}
        <main className="results-grid">
          {filteredData.length > 0 ? filteredData.map((item) => (
            <div key={item.id} className="service-card glass-panel">
              <div className="card-top">
                <div className={`avatar-box ${activeTab}`}>
                  {activeTab === 'doctors' ? '👨‍⚕️' : '🔬'}
                </div>
                <div className="info-box">
                  <h3>{item.name}</h3>
                  <p>{item.specialty || item.category}</p>
                  <div className="badge-row">
                    <span className="exp-tag">{item.experience || '4.5'} Rating</span>
                    <span className="status-tag">Available Today</span>
                  </div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="price-tag">
                  <span className="label">Consultation Fee</span>
                  <span className="amount">₹{item.fee || item.price}</span>
                </div>
                <button className="book-btn-main" onClick={() => navigate('/calendar')}>
                  Book Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-results">No {activeTab} found matching your search.</div>
          )}
        </main>
      </div>
    </div>
  );
}