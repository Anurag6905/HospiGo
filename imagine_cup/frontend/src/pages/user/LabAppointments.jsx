import { useState, useMemo, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/LabAppointments.css';

export default function LabAppointments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ 
    blood: false, 
    urine: false, 
    xray: false, 
    mri: false, 
    ctscan: false 
  });
  const [sortBy, setSortBy] = useState('closest');

  // NEW: loading + error + labs state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labs, setLabs] = useState([]);

  // Mock lab tests across hospitals (same data as before)
  const mockLabsData = [
    {
      id: 1,
      img: '../../../public/bloodtest.jpg',
      name: "Complete Blood Count (CBC)",
      hospital: "Apollo Hospital",
      price: "₹450",
      turnaround: "6-12 hours",
      category: "blood",
      available: true
    },
    {
      id: 2,
      img: '../../../public/micro.jpg',
      name: "Urine Routine & Microscopy",
      hospital: "Lilavati Hospital", 
      price: "₹250",
      turnaround: "4-8 hours",
      category: "urine",
      available: true
    },
    {
      id: 3,
      img: '../../../public/xray.jpg',
      name: "X-Ray Chest PA View",
      hospital: "Fortis Hospital",
      price: "₹800",
      turnaround: "2-4 hours",
      category: "xray",
      available: true
    },
    {
      id: 4,
      img: '../../../public/brain.jpg',
      name: "MRI Brain",
      hospital: "Apollo Hospital",
      price: "₹6500",
      turnaround: "24-48 hours",
      category: "mri",
      available: false
    },
    {
      id: 5,
      img: '../../../public/ctscan.jpg',
      name: "CT Scan Abdomen",
      hospital: "Lilavati Hospital",
      price: "₹4500",
      turnaround: "12-24 hours",
      category: "ctscan",
      available: true
    },
    {
      id: 6,
      img: '../../../public/test.jpg',
      name: "Lipid Profile",
      hospital: "Fortis Hospital",
      price: "₹600",
      turnaround: "8-12 hours",
      category: "blood",
      available: true
    },
    {
      id: 7,
      img: '../../../public/tumor.jpg',
      name: "Liver Function Test (LFT)",
      hospital: "Apollo Hospital",
      price: "₹700",
      turnaround: "6-10 hours",
      category: "blood",
      available: true
    },
  ];

  // NEW: simulate API call to load labs
  useEffect(() => {
    let isCancelled = false;

    const fetchLabs = async () => {
      try {
        setLoading(true);
        setError(null);

        // simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!isCancelled) {
          setLabs(mockLabsData);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Mock Error:', err);
          setError('Failed to load lab tests');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchLabs();

    return () => {
      isCancelled = true;
    };
  }, []); // run once on mount

  // Client-side filtering/sorting
  const filteredLabs = useMemo(() => {
    let result = labs.filter(lab => 
      (!searchQuery || 
       lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       lab.hospital.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Category filters
    Object.entries(filters).forEach(([key, active]) => {
      if (active) result = result.filter(lab => lab.category === key);
    });

    // Sort
    if (sortBy === 'closest') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'availability') {
      result.sort((a, b) => Number(b.available) - Number(a.available));
    } else if (sortBy === 'price') {
      result.sort(
        (a, b) =>
          parseInt(a.price.replace('₹', '')) -
          parseInt(b.price.replace('₹', ''))
      );
    }

    return result;
  }, [labs, searchQuery, filters, sortBy]);

  const toggleFilter = (category) => {
    setFilters(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const bookLabTest = (labId) => {
    const lab = labs.find(l => l.id === labId);
    if (!lab) return alert('Lab test not found');
    
    navigate(
      `/lab-calendar?lab=${labId}` +
      `&labName=${encodeURIComponent(lab.name)}` +
      `&hospital=${encodeURIComponent(lab.hospital)}`
    );
  };

  if (loading) return <div className="loading-container"><div className="spinner-large" /><p>Loading specialists...</p></div>;

  return (
    <div className="lab-booking-page">
      {/* Header */}
      <nav className="glass-nav">
            {/* Left: Logo */}
            <div className="nav-left">
              <button onClick={() => navigate('/user/services')} className="back-btn" />
              <div className="logo-section">
                <img src="/logo.png" alt="HospiGo" className="logo-circle" />
                <span className='logo-text'>Hospi<span>Go</span></span>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="nav-center">
              <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search hospitals near you..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-user"
                  />
                  <div className="search-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
              </div>
            </div>

            {/* Right: Nav Pills + Profile */}
            <div className="nav-right">
              <button 
                className={`nav-pill ${location.pathname === '/user/services' ? 'active' : ''}`} 
                onClick={() => navigate('/user/services')}
              >
                Home
              </button>
              <button 
                className={`nav-pill ${location.pathname === '/user/dashboard' ? 'active' : ''}`} 
                onClick={() => navigate('/user/dashboard')}
              >
                Map
              </button>
              <button 
                className={`nav-pill ${location.pathname === '/user/appointments' ? 'active' : ''}`} 
                onClick={() => navigate('/user/appointments')}
              >
                Doctors
              </button>
              <button 
                className={`nav-pill ${location.pathname === '/user/labs' ? 'active' : ''}`} 
                onClick={() => navigate('/user/labs')}
              >
                Labs
              </button>
              
              <button className="profile-btn5" onClick={() => navigate('/user/profile')}>
                <img src='../../../public/user.png' alt="Profile"/>
              </button>
            </div>
          </nav>

      <div className="main-layout">
        {/* Filters sidebar */}
        <div className="filters-sidebar">
          <div className="filter-group">
            <h3>Test Categories</h3>
            {Object.entries(filters).map(([key, active]) => (
              <label key={key} className={`filter-item ${active ? 'active' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={active} 
                  onChange={() => toggleFilter(key)} 
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Sort by</h3>
            <label className={`sort-radio ${sortBy === 'closest' ? 'active' : ''}`}>
              <input type="radio" name="sort" value="closest" checked={sortBy === 'closest'} onChange={e => setSortBy(e.target.value)} />
              Name (A-Z)
            </label>
            <label className={`sort-radio ${sortBy === 'availability' ? 'active' : ''}`}>
              <input type="radio" name="sort" value="availability" checked={sortBy === 'availability'} onChange={e => setSortBy(e.target.value)} />
              Availability
            </label>
            <label className={`sort-radio ${sortBy === 'price' ? 'active' : ''}`}>
              <input type="radio" name="sort" value="price" checked={sortBy === 'price'} onChange={e => setSortBy(e.target.value)} />
              Price (Low-High)
            </label>
          </div>
        </div>

        {/* Labs content */}
        <div className="labs-content">
          <div className="content-header">
            <h1>Lab Tests ({filteredLabs.length})</h1>
          </div>
          <div className="labs-list">
            {filteredLabs.length === 0 ? (
              <div className="no-labs">
                <div className="no-labs-icon" />
                <h3>No matching tests</h3>
                <button onClick={() => { setSearchQuery(''); setFilters({}); }}>Clear Filters</button>
              </div>
            ) : (
              filteredLabs.map(lab => (
                <div key={lab.id} className="lab-card">
                  <div className="lab-icon">
                    <img src={lab.img} />
                  </div>
                  <div className="lab-main-info">
                    <h3>{lab.name}</h3>
                    <div className="hospital-name">{lab.hospital}</div>
                    <div className="lab-details">
                      <span className="turnaround">{lab.turnaround}</span>
                      {lab.available ? (
                        <span className="available-badge">Available</span>
                      ) : (
                        <span className="unavailable-badge">Limited</span>
                      )}
                    </div>
                  </div>
                  <div className="lab-price">
                    <div className="price">{lab.price}</div>
                  </div>
                  <div className="lab-actions">
                    <button 
                      className={`book-btn ${!lab.available ? 'disabled' : ''}`}
                      onClick={() => bookLabTest(lab.id)}
                      disabled={!lab.available}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
 };
