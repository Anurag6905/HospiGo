// src/components/LabCalendar.jsx - COMPLETE (Pure JS, No Errors)
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../CSS/Calendar.css';

export default function LabCalendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const labId = searchParams.get('lab');
  const labName = searchParams.get('labName') || 'Lab Test';
  const hospital = searchParams.get('hospital') || '';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pure JS Date Utils (No date-fns)
  const formatDate = (date, formatStr) => {
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];

    if (formatStr === 'd') return day;
    if (formatStr === 'eee') return dayName;
    if (formatStr === 'MMM dd') return `${month} ${day}`;
    if (formatStr === 'MMM dd, yyyy') return `${month} ${day}, ${year}`;
    return date.toDateString();
  };

  const addDaysToDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getWeekDays(currentDate);

  const changeMonth = (daysOffset) => {
    const newDate = addDaysToDate(currentDate, daysOffset);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = Math.random() < 0.25;
        slots.push({ time, isBooked });
      }
    }
    return slots;
  };

  const handleDateSelect = (date) => {
    const slots = isSameDay(date, new Date()) ? generateTimeSlots(date).slice(0, 10) : generateTimeSlots(date);
    setTimeSlots(slots);
    setSelectedDate(date);
    setSelectedTime('');
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`✅ Lab test booked!\n\n${labName}\n${hospital}\n${formatDate(selectedDate, 'MMM dd')} at ${selectedTime}`);
    navigate('/labs/confirmation', {
      state: { labId, labName, hospital, date: selectedDate, time: selectedTime }
    });
    setLoading(false);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          onClick={() => {
            navigate(`/user/labs`);
          }} 
          className="back-btn" 
        />
        <div className="header-info">
          <h1>Schedule Lab Test</h1>
          <div className="doctor-info">
            <div className="doctor-avatar" style={{background: 'linear-gradient(135deg, #eab308, #ca8a04)'}} />
            <div>
              <div className="doctor-name">{decodeURIComponent(labName)}</div>
              <div className="doctor-subtitle">{decodeURIComponent(hospital)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-grid">
          <div className="calendar-nav">
            <button className="nav-btn prev" onClick={() => changeMonth(-7)}>‹</button>
            <div className="current-week">
              {formatDate(currentDate, 'MMM dd')} - {formatDate(addDaysToDate(currentDate, 6), 'MMM dd, yyyy')}
            </div>
            <button className="nav-btn next" onClick={() => changeMonth(7)}>›</button>
          </div>

          <div className="days-header">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>

          <div className="days-grid">
            {days.map((date) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <button
                  key={date.toString()}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}
                  onClick={() => handleDateSelect(date)}
                  disabled={isWeekend}
                >
                  <div className="day-number">{formatDate(date, 'd')}</div>
                  <div className="day-name">{formatDate(date, 'eee')}</div>
                  {isToday && <div className="today-badge">Today</div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="time-selector">
          <h3 className="section-title">Available Slots</h3>
          
          {selectedDate ? (
            <>
              <div className="selected-date">
                <div className="date-info">
                  <span className="date-text">{formatDate(selectedDate, 'eee, MMM dd')}</span>
                  <span className="date-subtitle">30min slots • Fast results</span>
                </div>
              </div>

              <div className="time-slots-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    className={`time-slot ${selectedTime === slot.time ? 'selected' : ''} ${slot.isBooked ? 'booked' : ''}`}
                    onClick={() => !slot.isBooked && setSelectedTime(slot.time)}
                    disabled={slot.isBooked}
                  >
                    {slot.time}
                    {slot.isBooked && <span className="booked-indicator">Booked</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon" />
              <h4>Select a date</h4>
              <p>Tap any weekday to view available time slots</p>
            </div>
          )}

          <button 
            className="confirm-booking-btn" 
            onClick={confirmBooking}
            disabled={!selectedDate || !selectedTime || loading}
          >
            {loading ? (
              <>
                <div className="spinner-small" />
                Booking Lab...
              </>
            ) : (
              `Book ${selectedTime || ''} Slot`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

