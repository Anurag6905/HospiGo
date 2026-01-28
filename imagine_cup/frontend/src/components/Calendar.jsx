import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../CSS/Calendar.css';

export default function Calendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const doctorName = searchParams.get('doctorName') || 'Doctor';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Mock available slots (9AM-7PM, 30min intervals, some booked)
  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 9;
    const endHour = 19;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Mock 30% booked slots
        const isBooked = Math.random() < 0.3;
        slots.push({ time, isBooked, duration: '30min' });
      }
    }
    return slots;
  };

  const days = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 })
  });

  const changeMonth = (daysOffset) => {
    setCurrentDate(addDays(currentDate, daysOffset));
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleDateSelect = (date) => {
    if (isSameDay(date, new Date())) {
      // Today - limited slots
      setTimeSlots(generateTimeSlots(date).slice(0, 12));
    } else {
      setTimeSlots(generateTimeSlots(date));
    }
    setSelectedDate(date);
    setSelectedTime('');
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    
    setLoading(true);
    // Mock booking delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const doctor = `${doctorName} (${format(selectedDate, 'MMM dd')}, ${selectedTime})`;
    alert(`✅ Appointment confirmed!\n\n${doctor}\n\nRedirecting to confirmation...`);
    
    // Navigate to confirmation
    navigate('/user/appointments/confirmation', {
      state: { doctorId, doctorName, date: selectedDate, time: selectedTime }
    });
    
    setLoading(false);
  };

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button onClick={() => navigate(-1)} className="back-btn" />
        <div className="header-info">
          <h1>Schedule Appointment</h1>
          <div className="doctor-info">
            <div className="doctor-avatar" />
            <div>
              <div className="doctor-name">{doctorName}</div>
              <div className="doctor-subtitle">Select date & time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-main">
        {/* Calendar Grid */}
        <div className="calendar-grid">
          <div className="calendar-nav">
            <button 
              className="nav-btn prev" 
              onClick={() => changeMonth(-7)}
              title="Previous week"
            >
              ‹
            </button>
            <div className="current-week">
              {format(currentDate, 'MMM dd')} - {format(addDays(currentDate, 6), 'MMM dd, yyyy')}
            </div>
            <button 
              className="nav-btn next" 
              onClick={() => changeMonth(7)}
              title="Next week"
            >
              ›
            </button>
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
                  <div className="day-number">{format(date, 'd')}</div>
                  <div className="day-name">{format(date, 'eee')}</div>
                  {isToday && <div className="today-badge">Today</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="time-selector">
          <h3 className="section-title">Available Slots</h3>
          
          {selectedDate ? (
            <>
              <div className="selected-date">
                <div className="date-info">
                  <span className="date-text">{format(selectedDate, 'eee, MMM dd')}</span>
                  <span className="date-subtitle">30min slots</span>
                </div>
              </div>

              <div className="time-slots-grid">
                {timeSlots.map((slot, idx) => (
                  <button
                    key={slot.time}
                    className={`time-slot ${selectedTime === slot.time ? 'selected' : ''} ${slot.isBooked ? 'booked' : ''}`}
                    onClick={() => setSelectedTime(slot.time)}
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

          {/* Confirm Button */}
          <button 
            className="confirm-booking-btn" 
            onClick={confirmBooking}
            disabled={!selectedDate || !selectedTime || loading}
          >
            {loading ? (
              <>
                <div className="spinner-small" />
                Confirming...
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
