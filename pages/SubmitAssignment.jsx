import { useState, useEffect } from 'react';

export default function SubmitAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    setAssignments(JSON.parse(localStorage.getItem('assignments') || '[]'));
    setEnrolled(JSON.parse(localStorage.getItem('enrolled') || '[]'));
    setSubmissions(JSON.parse(localStorage.getItem('submissions') || '[]'));
  }, [refreshKey]);

  const submit = (assignment) => {
    const alreadySubmitted = submissions.find(s => s.id === assignment.id);
    if (alreadySubmitted) {
      alert('You have already submitted this assignment');
      return;
    }

    const newSubmission = {
      ...assignment,
      submissionId: Date.now(),
      submittedAt: new Date().toISOString(),
      marks: null,
      studentName: JSON.parse(localStorage.getItem('user'))?.email || 'Student',
      submissionNotes: ''
    };

    const updatedSubmissions = [...submissions, newSubmission];
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    
    alert('Assignment Submitted Successfully!');
    setRefreshKey(refreshKey + 1);
  };

  const startEdit = (submission) => {
    setEditingSubmissionId(submission.submissionId);
    setEditDescription(submission.submissionNotes || '');
  };

  const saveEdit = (submission) => {
    const updatedSubmissions = submissions.map(s =>
      s.submissionId === submission.submissionId
        ? { ...s, submissionNotes: editDescription }
        : s
    );
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);
    setEditingSubmissionId(null);
    alert('Submission updated successfully!');
  };

  const cancelEdit = () => {
    setEditingSubmissionId(null);
    setEditDescription('');
  };

  const isAssignmentSubmitted = (assignmentId) => {
    return submissions.some(s => s.id === assignmentId);
  };

  const getAssignmentsForCourse = (courseName) => {
    return assignments.filter(a => a.course === courseName);
  };

  return (
    <div className='submit-assignment-container'>
      <div className='page-header'>
        <h1>Submit Assignments</h1>
        <p>Submit your course assignments</p>
      </div>

      {enrolled.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📚</div>
          <h2>No Enrolled Courses</h2>
          <p>Enroll in courses first to submit assignments</p>
        </div>
      ) : (
        <div className='enrolled-courses-with-assignments'>
          {enrolled.map(course => (
            <div key={course.id} className='course-assignment-section'>
              <div className='course-header-section'>
                <h2 className='course-title'>{course.name || course.title}</h2>
                <span className='course-due-time'>📅 {course.duration} weeks</span>
              </div>

              <div className='assignments-for-course'>
                {getAssignmentsForCourse(course.name || course.title).length === 0 ? (
                  <p className='no-assignments'>No assignments for this course</p>
                ) : (
                  getAssignmentsForCourse(course.name || course.title).map(assignment => {
                    const isSubmitted = isAssignmentSubmitted(assignment.id);
                    const submission = submissions.find(s => s.id === assignment.id);
                    return (
                      <div key={assignment.id} className='assignment-item'>
                        <div className='assignment-content'>
                          <div className='assignment-header'>
                            <h3 className='assignment-title'>{assignment.title}</h3>
                            <span className={`status-badge ${isSubmitted ? 'submitted' : 'pending'}`}>
                              {isSubmitted ? '✓ Submitted' : '○ Pending'}
                            </span>
                          </div>
                          <p className='assignment-description'>{assignment.description}</p>
                          {submission?.feedback && (
                            <div className='instructor-feedback-box'>
                              <div className='feedback-header-box'>📝 Instructor Feedback</div>
                              <div className='feedback-message-box'>{submission.feedback}</div>
                            </div>
                          )}
                          <div className='assignment-meta'>
                            <span className='meta-item'>
                              📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className='meta-item'>
                              ⭐ Max Marks: {assignment.maxMarks}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => submit(assignment)}
                          disabled={isSubmitted}
                          className={`btn ${isSubmitted ? 'btn-submitted' : 'btn-primary'}`}
                        >
                          {isSubmitted ? '✓ Submitted' : 'Submit Assignment'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {submissions.length > 0 && (
        <div className='submitted-assignments-section'>
          <h2>Your Submissions</h2>
          <div className='submissions-list'>
            {submissions.map(submission => (
              <div key={submission.submissionId} className='submission-item'>
                {editingSubmissionId === submission.submissionId ? (
                  <div className='submission-edit-mode'>
                    <div className='submission-header-edit'>
                      <div className='submission-info'>
                        <h3 className='submission-title'>{submission.title}</h3>
                        <p className='submission-course'>{submission.course}</p>
                      </div>
                      <div className='edit-status'>
                        <span className='edit-badge'>✎ Editing</span>
                      </div>
                    </div>

                    <div className='edit-form'>
                      <label>Submission Notes / Answers:</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder='Add or update your submission notes...'
                        className='edit-textarea'
                      />
                    </div>

                    <div className='edit-actions'>
                      <button
                        onClick={() => saveEdit(submission)}
                        className='btn btn-primary btn-save'
                      >
                        ✓ Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className='btn btn-secondary btn-cancel'
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='submission-info'>
                      <h3 className='submission-title'>{submission.title}</h3>
                      <p className='submission-course'>{submission.course}</p>
                      <div className='submission-date'>
                        Submitted on: {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {submission.submissionNotes && (
                        <div className='submission-notes'>
                          <strong>Notes:</strong> {submission.submissionNotes}
                        </div>
                      )}
                    </div>

                    <div className='submission-actions'>
                      <div className='submission-status'>
                        {submission.marks !== null ? (
                          <div className='marks-badge'>
                            <span className='mark-label'>Score</span>
                            <span className='mark-value'>{submission.marks}/{submission.maxMarks}</span>
                          </div>
                        ) : (
                          <>
                            <div className='pending-badge'>
                              <span>Pending Review</span>
                            </div>
                            <button
                              onClick={() => startEdit(submission)}
                              className='btn btn-edit-submission'
                            >
                              ✎ Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}