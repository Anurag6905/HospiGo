import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Appointments.css'; // Reuse existing CSS

export default function Appointments() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = parseInt(localStorage.getItem('userid'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ cardiology: false, physiotherapist: false, neurosurgeon: false });
  const [sortBy, setSortBy] = useState('closest');

  // ✅ MOCK DATA - No backend needed
  const fetchData = useCallback(async () => {
    if (!userId) {
      setError('Please login first');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      // Mock specialists across hospitals
      const mockSpecialists = [
        {
          id: 1,
          name: "Dr. Amit Sharma",
          specialty: "Cardiology",
          timing: "Mon-Fri 9AM-5PM",
          hospital_id: 1,
          hospital: { name: "Apollo Hospital" }
        },
        {
          id: 2,
          name: "Dr. Priya Patel",
          specialty: "Physiotherapist",
          timing: "Mon-Sat 10AM-6PM",
          hospital_id: 1,
          hospital: { name: "Apollo Hospital" }
        },
        {
          id: 3,
          name: "Dr. Rahul Desai",
          specialty: "Neurosurgeon",
          timing: "Tue-Thu 2PM-8PM",
          hospital_id: 2,
          hospital: { name: "Lilavati Hospital" }
        },
        {
          id: 4,
          name: "Dr. Sneha Gupta",
          specialty: "Cardiology",
          timing: "Daily 8AM-4PM",
          hospital_id: 2,
          hospital: { name: "Lilavati Hospital" }
        },
        {
          id: 5,
          name: "Dr. Vikram Singh",
          specialty: "Physiotherapist",
          timing: "Mon-Fri 11AM-7PM",
          hospital_id: 3,
          hospital: { name: "Fortis Hospital" }
        },
        {
          id: 6,
          name: "Dr. Meera Joshi",
          specialty: "Neurosurgeon",
          timing: "Wed-Fri 1PM-7PM",
          hospital_id: 3,
          hospital: { name: "Fortis Hospital" }
        },
        // Add more for testing
        {
          id: 7,
          name: "Dr. Karan Mehta",
          specialty: "Cardiology",
          timing: "Sat-Sun 10AM-4PM",
          hospital_id: 1,
          hospital: { name: "Apollo Hospital" }
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setDoctors(mockSpecialists);
    } catch (err) {
      console.error('Mock Error:', err);
      setError('Failed to load specialists');
    } finally {
      setLoading(false);
    }
  }, [userId]);
 
  // Client-side filtering/sorting
  const filteredDoctors = useMemo(() => {
    let result = doctors.filter(d => 
      (!searchQuery || 
       d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       d.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filters by specialty
    Object.entries(filters).forEach(([key, active]) => {
      if (active) result = result.filter(d => d.specialty.toLowerCase().includes(key));
    });

    // Sort
    if (sortBy === 'closest') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'availability') {
      result.sort((a, b) => (b.timing?.length || 0) - (a.timing?.length || 0));
    }
    return result;
  }, [doctors, searchQuery, filters, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ MOCK BOOKING - No backend call
  const confirmAppointmentBooking = (specialistId) => {
    const doctor = doctors.find(d => d.id === specialistId);
    if (!doctor) return alert('Doctor not found');
    
    // Navigate to calendar with doctor details
    navigate(`/calendar?doctor=${specialistId}&doctorName=${encodeURIComponent(doctor.name)}`);
  };

  const toggleFilter = (specialty) => {
    setFilters(prev => ({ ...prev, [specialty]: !prev[specialty] }));
  };

  if (loading) return <div className="loading-container"><div className="spinner-large" /><p>Loading specialists...</p></div>;
  if (error) return <div className="error-container"><p>{error}</p><button onClick={() => navigate('/user/hospitals')}>Find Hospitals</button></div>;

  return (
    <div className="doctors-booking-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/user/services')} className="back-btn" />
        <div className="logo-section">
          <img src="/logo.png" alt="HospiGo" className="logo-circle" />
          <span className='logo-text'>Hospi<span>Go</span></span>
        </div>
        <input
          placeholder="Search doctors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="header-search"
        />
        <button className="profile-btn1" onClick={() => navigate('/user/profile')}>
            <img src='../../../public/user.png'></img>
        </button>
      </div>

      <div className="main-layout">
        {/* Filters sidebar */}
        <div className="filters-sidebar">
          <div className="filter-group">
            <h3>Specialties</h3>
            {Object.entries(filters).map(([key, active]) => (
              <label key={key} className={`filter-item ${active ? 'active' : ''}`}>
                <input type="checkbox" checked={active} onChange={() => toggleFilter(key)} />
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
          </div>
        </div>

        {/* Doctors content */}
        <div className="doctors-content">
          <div className="content-header">
            <h1>Available Doctors ({filteredDoctors.length})</h1>
          </div>
          <div className="doctors-list">
            {filteredDoctors.length === 0 ? (
              <div className="no-doctors">
                <div className="no-doctors-icon" />
                <h3>No matching specialists</h3>
                <button onClick={() => { setSearchQuery(''); Object.keys(filters).forEach(k => setFilters(prev => ({...prev, [k]: false}))); }}>Clear All Filters</button>
              </div>
            ) : (
              filteredDoctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-photo">
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&fit=crop&crop=face" alt={doctor.name} />
                  </div>
                  <div className="doctor-main-info">
                    <h3>{doctor.name}</h3>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                    <div className="hospital-name">{doctor.hospital?.name || `Hospital ${doctor.hospital_id}`}</div>
                    <div className="doctor-timing">{doctor.timing}</div>
                  </div>
                  <div className="doctor-rating-section">
                    <div className="rating-stars">4.7 ★</div>
                  </div>
                  <div className="doctor-actions">
                    <span className="available-badge">Available Now</span>
                    <button className="book-now-btn" onClick={() => {
                        navigate(`/calendar?doctor=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}`);}} disabled={loading}>
                      Book Now
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
}
