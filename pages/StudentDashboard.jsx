import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventsCalendar } from '../components/EventsCalendar';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) return;
    
    Promise.all([
      fetch(`http://localhost:8080/api/enrollments/student/${user.email}`).then(r => r.json()),
      fetch(`http://localhost:8080/api/submissions/student/${user.email}`).then(r => r.json()),
      fetch('http://localhost:8080/api/courses').then(r => r.json()),
      fetch('http://localhost:8080/api/assignments').then(r => r.json())
    ]).then(([es, ss, cs, as]) => {
      const enrolledObjects = cs.filter(c => es.find(e => e.courseId === c.id));
      setEnrolled(enrolledObjects);
      setSubmissions(ss);
      setCourses(cs);
      setAllAssignments(as);
    }).catch(console.error);
  }, []);

  const getCourseDueDate = (courseId) => {
    const course = courses.find(c => c.id.toString() === courseId);
    return course ? course.duration : null;
  };

  const getPendingAssignments = () => {
    const enrolledCourseNames = enrolled.map(c => c.name || c.title);
    const submittedAssignmentIds = submissions.map(s => s.assignmentId || s.id);
    
    return allAssignments.filter(assignment => 
      enrolledCourseNames.includes(assignment.course) && 
      !submittedAssignmentIds.includes(assignment.id)
    );
  };

  const pendingAssignments = getPendingAssignments();
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const d = new Date(dueDate);
    return !isNaN(d.getTime()) && d < new Date();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'No due date' : d.toLocaleDateString();
  };

  return (
    <div className='student-dashboard-container'>
      <div className='stats-grid'>
        <div
          className='stat-card clickable'
          onClick={() => navigate('/student/enroll')}
          title='View enrolled courses'
        >
          <div className='stat-icon' style={{ backgroundColor: '#3b82f6' }}>📚</div>
          <div className='stat-content'>
            <p className='stat-label'>Enrolled Courses</p>
            <p className='stat-number'>{enrolled.length}</p>
          </div>
        </div>

        <div
          className='stat-card clickable'
          onClick={() => navigate('/student/submit-assignment')}
          title='View submitted assignments'
        >
          <div className='stat-icon' style={{ backgroundColor: '#10b981' }}>📋</div>
          <div className='stat-content'>
            <p className='stat-label'>Submitted Assignments</p>
            <p className='stat-number'>{submissions.length}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#f59e0b' }}>⏳</div>
          <div className='stat-content'>
            <p className='stat-label'>Pending Assignments</p>
            <p className='stat-number'>{pendingAssignments.length}</p>
          </div>
        </div>
      </div>

      <div className='quick-actions'>
        <h2>Quick Actions</h2>
        <div className='actions-grid'>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #3b82f6' }}
            onClick={() => navigate('/student/enroll')}
          >
            <div className='action-icon'>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3>Enroll in Courses</h3>
            <p>Browse and enroll in available courses</p>
          </div>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #10b981' }}
            onClick={() => navigate('/student/submit-assignment')}
          >
            <div className='action-icon'>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 17v-6"></path>
                <path d="M9 14h6"></path>
              </svg>
            </div>
            <h3>Submit Assignment</h3>
            <p>Submit your course assignments</p>
          </div>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #f59e0b' }}
            onClick={() => navigate('/student/grades')}
          >
            <div className='action-icon'>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 19.5H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5"></path>
                <path d="M22 13v5a2 2 0 0 1-2 2h-3"></path>
                <path d="M12 12h.01"></path>
                <path d="M16 12h.01"></path>
                <path d="M20 12h.01"></path>
                <path d="M12 16h.01"></path>
                <path d="M16 16h.01"></path>
              </svg>
            </div>
            <h3>Progress</h3>
            <p>Check your assignment grades</p>
          </div>
        </div>
      </div>

      <div className='calendar-section'>
        <EventsCalendar />
      </div>

      <div className='assignments-summary-section'>
        <div className='submissions-column'>
          {submissions.length > 0 && (
            <div className='submitted-assignments-box'>
              <h2>Submitted Assignments</h2>
              <div className='assignments-list'>
                {submissions.map(submission => (
                  <div key={submission.submissionId} className='assignment-summary-card'>
                    <div className='assignment-summary-header'>
                      <h3>{submission.title}</h3>
                      <span className='status-badge submitted'>✓ Submitted</span>
                    </div>
                    <p className='assignment-course'>{submission.course}</p>
                    <div className='assignment-summary-meta'>
                      <span className='submitted-date'>
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                      {submission.marks !== null ? (
                        <span className='marks-info'>
                          Score: {submission.marks}/{submission.maxMarks}
                        </span>
                      ) : (
                        <span className='pending-review'>Pending Review</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='pending-column'>
          {pendingAssignments.length > 0 && (
            <div className='pending-assignments-box'>
              <h2>Pending Assignments</h2>
              <div className='assignments-list'>
                {pendingAssignments.map(assignment => (
                  <div key={assignment.id} className={`assignment-summary-card ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                    <div className='assignment-summary-header'>
                      <h3>{assignment.title}</h3>
                      <span className={`status-badge ${isOverdue(assignment.dueDate) ? 'overdue' : 'pending'}`}>
                        {isOverdue(assignment.dueDate) ? '⚠ Overdue' : '○ Pending'}
                      </span>
                    </div>
                    <p className='assignment-course'>{assignment.course}</p>
                    <div className='assignment-summary-meta'>
                      <span className={`due-date ${isOverdue(assignment.dueDate) ? 'overdue-text' : ''}`}>
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                      <span className='max-marks'>Max Marks: {assignment.maxMarks}</span>
                    </div>
                    <button
                      onClick={() => navigate('/student/submit-assignment')}
                      className='btn btn-submit-pending'
                    >
                      Submit Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pendingAssignments.length === 0 && submissions.length === 0 && (
            <div className='no-assignments-message'>
              <p>No assignments yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {enrolled.length > 0 && (
        <div className='enrolled-courses-section'>
          <h2>Enrolled Courses</h2>
          <div className='courses-grid'>
            {enrolled.map(course => (
              <div key={course.id} className='course-card'>
                <div className='course-header'>
                  <h3>{course.name || course.title}</h3>
                  <span className='course-code'>{course.code}</span>
                </div>
                <p className='course-description'>{course.description}</p>
                <div className='course-info'>
                  <span className='course-duration'>📅 {course.duration || 'N/A'} weeks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};