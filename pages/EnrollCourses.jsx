import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const EnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(console.error);
      
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      fetch(`${API_URL}/api/enrollments/student/${user.email}`)
        .then(res => res.json())
        .then(data => setEnrollments(data))
        .catch(console.error);
    }
  }, [refreshKey]);

  const enroll = (course) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) return alert('Please login first');
    
    fetch(`${API_URL}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentEmail: user.email, courseId: course.id })
    })
    .then(res => {
      if (res.ok) {
        alert('Enrolled Successfully!');
        setRefreshKey(k => k + 1);
      } else {
        alert('Already enrolled or error');
      }
    })
    .catch(console.error);
  };

  const enrolled = courses.filter(c => enrollments.some(e => e.courseId === c.id));
  const availableCourses = courses.filter(c => !enrollments.some(e => e.courseId === c.id));

  return (
    <div className='enroll-courses-container'>
      <div className='page-header'>
        <h1>Available Courses</h1>
        <p>Browse and enroll in courses</p>
      </div>

      {enrolled.length > 0 && (
        <div className='enrolled-courses-list'>
          <div className='enrolled-header'>
            <h2>Your Enrolled Courses ({enrolled.length})</h2>
          </div>
          <div className='enrolled-courses-cards'>
            {enrolled.map(course => (
              <div key={course.id} className='enrolled-course-card'>
                <div className='enrolled-course-header'>
                  <div className='enrolled-course-info'>
                    <span className='course-icon'>📚</span>
                    <div>
                      <h3 className='enrolled-course-name'>{course.name || course.title}</h3>
                      <p className='enrolled-course-code'>{course.code}</p>
                    </div>
                  </div>
                </div>
                <p className='enrolled-course-description'>{course.description}</p>
                <div className='enrolled-course-meta'>
                  <span className='meta-duration'>📅 {course.duration} weeks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableCourses.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📖</div>
          <h2>No Courses Available</h2>
          <p>Check back later for new courses</p>
        </div>
      ) : (
        <div className='available-courses-section'>
          <h2 className='available-courses-title'>Available Courses for Enrollment</h2>
          <div className='courses-grid'>
            {availableCourses.map(course => (
              <div key={course.id} className='course-card'>
                <div className='course-header'>
                  <h3>{course.name || course.title}</h3>
                  <span className='course-code'>{course.code}</span>
                </div>
                <p className='course-description'>{course.description}</p>
                <div className='course-info'>
                  <span className='course-duration'>📅 {course.duration} weeks</span>
                </div>
                <button
                  onClick={() => enroll(course)}
                  className='btn btn-primary btn-enroll'
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};