import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const EventsCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolled') || '[]');
    setAssignments(allAssignments);
    setEnrolled(enrolledCourses);
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInCurrentMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days from previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push(i);
    }

    setDaysInMonth(days);
  };

  const getEventsForDate = (day) => {
    if (!day) return [];

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;

    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
      if (selectedCourse === 'all') {
        return dueDate === dateStr;
      }
      return dueDate === dateStr && assignment.course === selectedCourse;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayClick = (dayHasEvents) => {
    if (dayHasEvents) {
      navigate('/student/submit-assignment');
    }
  };

  return (
    <div className='events-calendar'>
      <div className='calendar-header'>
        <div className='calendar-title'>
          <span className='calendar-icon'>📅</span>
          <h2>Calendar</h2>
        </div>
        <button className='new-event-btn'>New event</button>
      </div>

      <div className='calendar-controls'>
        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
          className='course-filter'
        >
          <option value='all'>All courses</option>
          {enrolled.map(course => (
            <option key={course.id} value={course.name || course.title}>
              {course.name || course.title}
            </option>
          ))}
        </select>
      </div>

      <div className='calendar-navigation'>
        <button onClick={goToPreviousMonth} className='nav-btn'>‹ January</button>
        <h3 className='current-month'>{monthYear}</h3>
        <button onClick={goToNextMonth} className='nav-btn'>March ›</button>
      </div>

      <div className='calendar-weekdays'>
        {dayNames.map(day => (
          <div key={day} className='weekday-header'>{day}</div>
        ))}
      </div>

      <div className='calendar-grid'>
        {daysInMonth.map((day, index) => {
          const events = getEventsForDate(day);
          const hasEvents = events.length > 0;
          const isToday = 
            day &&
            new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear();

          return (
            <div 
              key={index} 
              className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
              onClick={() => handleDayClick(day && hasEvents)}
            >
              {day && (
                <>
                  <div className='day-number'>{day}</div>
                  {hasEvents && (
                    <div className='events-list'>
                      {events.slice(0, 3).map((event, i) => (
                        <div key={i} className='event-item'>
                          <span className='event-dot'>•</span>
                          <span className='event-text'>{event.title}</span>
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className='more-events'>+{events.length - 3} more</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className='calendar-footer'>
        <p className='full-calendar-link'>Full calendar</p>
      </div>
    </div>
  );
};
