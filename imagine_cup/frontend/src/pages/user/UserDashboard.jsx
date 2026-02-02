// UserDashboard.jsx - HospiGo ICU Map Dashboard (Enhanced UI/UX Match)
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/api';
import '../../CSS/UserDashboard.css';

// Fix Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationFound }) {
  useMapEvents({
    locationfound: (e) => {
      onLocationFound(e.latlng);
    },
  });
  return null;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState([19.0760, 72.8777]); // Mumbai/Bandra center
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ beds: false, icu: false, oncology: false, xrays: false, mri:false, ctscan:false, pathology:false }); 
  const [sortBy, setSortBy] = useState('closest');

  const realHospitals = [ 
    { hospital_id: 1, img:"../../public/1.jpg", name: 'Apollo Hospitals', lat: 19.0694, lng: 72.8258, availableBeds: 45, totalBeds: 300, rating: 4.5, specialties: ['ICU'] },
    { hospital_id: 2, img:"../../public/2.jpg", name: 'Cigma Hospital', lat: 19.0542, lng: 72.8250, availableBeds: 31, totalBeds: 250, rating: 4.0, specialties: ['ICU', 'Cardiology'] },
    { hospital_id: 3, img:"../../public/3.jpg", name: 'Kamlayan Bajaj', lat: 19.0720, lng: 72.8340, availableBeds: 42, totalBeds: 280, rating: 4.2, specialties: ['ICU'] },
    { hospital_id: 4, img:"../../public/4.jpg", name: 'Hedgewar Hospital', lat: 19.1245, lng: 72.8231, availableBeds: 28, totalBeds: 220, rating: 4.3, specialties: ['ICU'] },
    { hospital_id: 5, img:"../../public/5.jpg", name: 'Nanavati Hospital', lat: 19.0630, lng: 72.8210, availableBeds: 15, totalBeds: 120, rating: 4.1, specialties: ['ICU', 'Oncology'] },
  ];

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/hospitals/beds');
      
      // Merge real hospitals + backend data
      let allHospitals = [
        ...realHospitals,
        ...res.data.map((bed) => ({
          hospital_id: bed.hospital_id,
          name: `Hospital ${bed.hospital_id}`,
          lat: 19.0760 + (bed.hospital_id * 0.001),
          lng: 72.8777 + (bed.hospital_id * 0.001),
          availableBeds: bed.available,
          totalBeds: bed.total,
          rating: 4.0,
          specialties: [],
        }))
      ];

      // Filters
      if (filters.beds) allHospitals = allHospitals.filter(h => h.availableBeds > 0);
      if (filters.icu) allHospitals = allHospitals.filter(h => h.specialties.includes('ICU'));
      if (filters.oncology) allHospitals = allHospitals.filter(h => h.specialties.includes('Oncology'));
      if (filters.beds) allHospitals = allHospitals.filter(h => h.specialties.includes('beds'));
      if (filters.xrays) allHospitals = allHospitals.filter(h => h.specialties.includes('xrays'));
      if (filters.mri) allHospitals = allHospitals.filter(h => h.specialties.includes('mri'));
      if (filters.ctscan) allHospitals = allHospitals.filter(h => h.specialties.includes('ctscan'));
      if (filters.oncology) allHospitals = allHospitals.filter(h => h.specialties.includes('pathology'));
      
      if (searchQuery) allHospitals = allHospitals.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sort
      if (sortBy === 'closest') {
        allHospitals.sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.lat - userLocation[0], 2) + Math.pow(a.lng - userLocation[1], 2));
          const distB = Math.sqrt(Math.pow(b.lat - userLocation[0], 2) + Math.pow(b.lng - userLocation[1], 2));
          return distA - distB;
        });
      } else if (sortBy === 'availability') {
        allHospitals.sort((a, b) => (b.availableBeds || 0) - (a.availableBeds || 0));
      }

      setHospitals(allHospitals.slice(0, 50));
    } catch (err) {
      console.error(err);
      setHospitals(realHospitals); 
    } finally {
      setLoading(false);
    }
  }, [userLocation, filters, searchQuery, sortBy]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.log('Using Bandra location')
      );
    }
  }, []);

  const toggleFilter = (filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const hospitalIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=6OOnASO9fxuG&format=png&color=000000',
    iconSize: [34, 34],
    iconAnchor: [12, 34],
    popupAnchor: [0, -34],
  });

  if (loading) return <div className="loading-container"><div className="spinner-large" /><p>Loading near by Hospitals</p></div>;

  return (
    <div className="dashboard-container">
      {/* Premium Glass Header */}
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

      <div className="main-map">
        <div className="filters-sidebar">
          <h3>Filters</h3>
          <label className={`filter-option ${filters.icu ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.icu} onChange={() => toggleFilter('icu')} />
            ICU
          </label>
          <label className={`filter-option ${filters.oncology ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.oncology} onChange={() => toggleFilter('oncology')} />
            Oncology
          </label>
          <label className={`filter-option ${filters.beds ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.beds} onChange={() => toggleFilter('beds')} />
            Beds Available
          </label>
          <label className={`filter-option ${filters.beds ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.xrays} onChange={() => toggleFilter('xrays')} />
            X-Rays
          </label>
          <label className={`filter-option ${filters.beds ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.mri} onChange={() => toggleFilter('mri')} />
            MRI
          </label>
          <label className={`filter-option ${filters.beds ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.ctscan} onChange={() => toggleFilter('ctscan')} />
            CT Scan
          </label>
          <label className={`filter-option ${filters.beds ? 'active' : ''}`} tabIndex={0}>
            <input type="checkbox" checked={filters.pathology} onChange={() => toggleFilter('pathology')} />
            Pathology
          </label>
          <button className="clear-filters" onClick={() => setFilters({})}>Clear All</button>
        </div>

        <div className="map-section">
          <MapContainer center={userLocation} zoom={13} className="hospi-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationFound={setUserLocation} />
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
            {hospitals.map((hospital, idx) => (
              <Marker key={hospital.hospital_id || idx} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
                <Popup>
                  <div>
                    <h4>{hospital.name}</h4>
                    <p>{hospital.availableBeds}/{hospital.totalBeds} beds</p>
                    <button className="book-btn" onClick={() => navigate(`/user/hospital/id`)}>
                      Book Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="hospitals-row">
        {hospitals.slice(2, 9).map((hospital, idx) => (
          <div key={hospital.hospital_id || idx} className="hospital-card" style={{animationDelay: `${idx * 0.1}s`}}>
            <div className="hospital-image">
              <img src={hospital.img} alt={hospital.name} />
            </div>
            <div className="hospital-details">
              <h3>{hospital.name}</h3>
              <div className="rating">{hospital.rating} ★</div>
              <button className="book-now-btn" onClick={() => navigate(`/user/hospital/id`)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
