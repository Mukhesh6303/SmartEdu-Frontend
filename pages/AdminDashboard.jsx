import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/courses').then(r => r.json()),
      fetch('http://localhost:8080/api/assignments').then(r => r.json()),
      fetch('http://localhost:8080/api/enrollments').then(r => r.json()),
      fetch('http://localhost:8080/api/submissions').then(r => r.json())
    ]).then(([cs, as, es, ss]) => {
      setCourses(cs); setAssignments(as); setEnrolled(es); setSubmissions(ss);
    }).catch(console.error);
  }, []);

  const pendingSubmissions = submissions.filter(
    (submission) => submission.marks === null || submission.marks === undefined
  );

  return (
    <div className='dashboard-container'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#3b82f6' }}>📚</div>
          <div className='stat-content'>
            <p className='stat-label'>Total Courses</p>
            <p className='stat-number'>{courses.length}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#10b981' }}>👥</div>
          <div className='stat-content'>
            <p className='stat-label'>Total Students</p>
            <p className='stat-number'>{enrolled.length}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#f59e0b' }}>📋</div>
          <div className='stat-content'>
            <p className='stat-label'>Total Assignments</p>
            <p className='stat-number'>{assignments.length}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#a855f7' }}>📤</div>
          <div className='stat-content'>
            <p className='stat-label'>Total Submissions</p>
            <p className='stat-number'>{submissions.length}</p>
          </div>
        </div>
      </div>

      <div className='pending-grading-section'>
        <button
          className='pending-summary-card'
          onClick={() => navigate('/admin/view-submissions')}
        >
          <div className='pending-summary-icon'>⏳</div>
          <div className='pending-summary-content'>
            <span className='pending-summary-label'>Pending Grading</span>
            <span className='pending-summary-count'>{pendingSubmissions.length}</span>
          </div>
        </button>
      </div>

      <div className='quick-actions'>
        <h2>Quick Actions</h2>
        <div className='actions-grid'>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #3b82f6' }}
            onClick={() => navigate('/admin/create-course')}
          >
            <div className='action-icon'>
              <svg width="64" height="64" viewBox="0 0 200 140" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="35" y="20" width="130" height="80" rx="8" ry="8" />
                <line x1="50" y1="40" x2="70" y2="50" />
                <line x1="70" y1="40" x2="50" y2="50" />
                <path d="M60 55 L70 60 L60 65 Z" />
                <line x1="85" y1="42" x2="110" y2="42" />
                <line x1="85" y1="52" x2="145" y2="52" />
                <line x1="85" y1="62" x2="145" y2="62" />
                <line x1="85" y1="72" x2="130" y2="72" />
                <rect x="45" y="110" width="110" height="12" rx="3" ry="3" />
              </svg>
            </div>
            <h3>Create New Course</h3>
            <p>Add a new course to the system</p>
          </div>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #10b981' }}
            onClick={() => navigate('/admin/create-assignment')}
          >
            <div className='action-icon'>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h3>Create Assignment</h3>
            <p>Add assignments for courses</p>
          </div>
          <div 
            className='action-card' 
            style={{ borderTop: '4px solid #a855f7' }}
            onClick={() => navigate('/admin/view-submissions')}
          >
            <div className='action-icon'>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path>
                <path d="M9 4h4"></path>
                <path d="M9 8h6"></path>
                <path d="M9 12h6"></path>
                <path d="M9 16h4"></path>
                <circle cx="16" cy="15" r="5"></circle>
                <path d="M14.5 16l1 1.5 2-2.5"></path>
              </svg>
            </div>
            <h3>Review Submissions</h3>
            <p>Grade student assignments</p>
          </div>
        </div>
      </div>
    </div>
  );
};