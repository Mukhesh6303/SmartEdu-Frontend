import { useState, useEffect } from 'react';

export const EnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem('courses') || '[]'));
    setEnrolled(JSON.parse(localStorage.getItem('enrolled') || '[]'));
  }, [refreshKey]);

  const enroll = (course) => {
    if (enrolled.find(c => c.id === course.id)) {
      return alert('Already enrolled');
    }
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const studentId = user?.email || 'Student';
    const updatedEnrolled = [
      ...enrolled,
      {
        ...course,
        studentName: studentId,
        studentId
      }
    ];
    localStorage.setItem('enrolled', JSON.stringify(updatedEnrolled));
    setEnrolled(updatedEnrolled);
    alert('Enrolled Successfully!');
  };

  const unenroll = (courseId) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      const updatedEnrolled = enrolled.filter(c => c.id !== courseId);
      localStorage.setItem('enrolled', JSON.stringify(updatedEnrolled));
      setEnrolled(updatedEnrolled);
      setRefreshKey(refreshKey + 1);
      alert('Unenrolled Successfully!');
    }
  };

  const availableCourses = courses.filter(
    course => !enrolled.find(e => e.id === course.id)
  );

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
                  <button
                    onClick={() => unenroll(course.id)}
                    className='btn btn-unenroll'
                    title='Unenroll from this course'
                  >
                    ✕ Unenroll
                  </button>
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