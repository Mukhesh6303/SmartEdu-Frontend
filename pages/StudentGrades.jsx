import { useEffect, useState } from 'react';

export default function StudentGrades() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setSubmissions(JSON.parse(localStorage.getItem('submissions') || '[]'));
  }, []);

  const gradedSubmissions = submissions.filter(s => s.marks !== null);
  const totalSubmissions = submissions.length;
  const averageGrade = submissions.length > 0 
    ? Math.round((gradedSubmissions.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubmissions.length))
    : 0;

  return (
    <div className='student-grades-container'>
      <div className='page-header'>
        <h1>Your Grades</h1>
        <p>View your assignment grades and progress</p>
      </div>

      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#3b82f6' }}>📌</div>
          <div className='stat-content'>
            <p className='stat-label'>Total Submissions</p>
            <p className='stat-number'>{totalSubmissions}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#10b981' }}>✅</div>
          <div className='stat-content'>
            <p className='stat-label'>Graded</p>
            <p className='stat-number'>{gradedSubmissions.length}</p>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#a855f7' }}>📈</div>
          <div className='stat-content'>
            <p className='stat-label'>Average Grade</p>
            <p className='stat-number'>{averageGrade}%</p>
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📋</div>
          <h2>No Submissions Yet</h2>
          <p>Your submitted assignments will appear here</p>
        </div>
      ) : (
        <div className='grades-list'>
          {submissions.map(sub => (
            <div key={sub.id} className='grade-card'>
              <div className='grade-header'>
                <div className='grade-title-section'>
                  <span className='grade-check'>✅</span>
                  <div>
                    <h3 className='grade-title'>{sub.title}</h3>
                    <p className='grade-course'>{sub.course}</p>
                  </div>
                </div>
                {sub.marks !== null && (
                  <div className='grade-score-display'>{sub.marks}/100</div>
                )}
              </div>

              <div className='submission-details'>
                <div className='detail-item'>
                  <span className='detail-time'>
                    Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}, {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {sub.marks !== null && (
                <div className='score-section'>
                  <div className='score-header'>
                    <label>Your Score:</label>
                    <span className='score-value'>{sub.marks}/100</span>
                  </div>
                  <div className='score-details'>
                    <label>Percentage</label>
                    <div className='progress-bar'>
                      <div className='progress-fill' style={{ width: `${sub.marks}%` }}></div>
                    </div>
                    <span className='percentage-text'>{sub.marks}%</span>
                  </div>
                  {sub.feedback && (
                    <div className='feedback-section'>
                      <label className='feedback-label'>Instructor Feedback:</label>
                      <div className='feedback-content'>{sub.feedback}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
