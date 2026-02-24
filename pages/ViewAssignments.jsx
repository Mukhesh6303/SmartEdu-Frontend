import { useEffect, useState } from 'react';

export default function ViewAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [marksInput, setMarksInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState({});

  useEffect(() => {
    setSubmissions(JSON.parse(localStorage.getItem('submissions') || '[]'));
  }, []);

  const handleUpdateMarks = (id, marks, feedback) => {
    const updated = submissions.map(sub =>
      sub.id === id ? { ...sub, marks: parseInt(marks) || 0, feedback: feedback || '' } : sub
    );
    localStorage.setItem('submissions', JSON.stringify(updated));
    setSubmissions(updated);
    setEditingId(null);
    setMarksInput({});
    setFeedbackInput({});
    alert('Marks and feedback updated successfully!');
  };

  const handleEdit = (id, currentMarks, currentFeedback) => {
    setEditingId(id);
    setMarksInput({ ...marksInput, [id]: currentMarks || '' });
    setFeedbackInput({ ...feedbackInput, [id]: currentFeedback || '' });
  };

  return (
    <div className='view-submissions-container'>
      <div className='page-header'>
        <h1>Review Submissions</h1>
        <p>Grade student assignments</p>
      </div>

      {submissions.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📤</div>
          <h2>No Submissions Yet</h2>
          <p>Student submissions will appear here</p>
        </div>
      ) : (
        <div className='submissions-table'>
          <div className='table-header'>
            <div className='col-title'>Assignment Title</div>
            <div className='col-student'>Student Name</div>
            <div className='col-submitted'>Submitted At</div>
            <div className='col-status'>Status</div>
            <div className='col-marks'>Marks</div>
            <div className='col-actions'>Actions</div>
          </div>
          {submissions.map((s) => (
            <div key={s.id} className='table-row'>
              <div className='col-title'>
                <span className='assignment-icon'>📋</span>
                {s.title}
              </div>
              <div className='col-student'>{s.studentName || 'Unknown'}</div>
              <div className='col-submitted'>
                {new Date(s.submittedAt).toLocaleDateString()} {new Date(s.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className='col-status'>
                <span className={`status-badge ${s.marks ? 'graded' : 'pending'}`}>
                  {s.marks ? 'Graded' : 'Pending'}
                </span>
              </div>
              <div className='col-marks'>
                {editingId === s.id ? (
                  <div className='grading-form'>
                    <input
                      type='number'
                      className='marks-input'
                      value={marksInput[s.id] || ''}
                      onChange={(e) => setMarksInput({ ...marksInput, [s.id]: e.target.value })}
                      placeholder='Enter marks'
                      autoFocus
                    />
                    <textarea
                      className='feedback-textarea'
                      value={feedbackInput[s.id] || ''}
                      onChange={(e) => setFeedbackInput({ ...feedbackInput, [s.id]: e.target.value })}
                      placeholder='Add feedback for student'
                      rows='3'
                    />
                  </div>
                ) : (
                  <div className='marks-display-section'>
                    <span className='marks-display'>{s.marks || '-'}</span>
                    {s.feedback && <div className='feedback-badge'>Feedbacked</div>}
                  </div>
                )}
              </div>
              <div className='col-actions'>
                {editingId === s.id ? (
                  <>
                    <button
                      className='btn btn-submit btn-sm'
                      onClick={() => handleUpdateMarks(s.id, marksInput[s.id], feedbackInput[s.id])}
                    >
                      ✓ Submit
                    </button>
                    <button
                      className='btn btn-cancel btn-sm'
                      onClick={() => {
                        setEditingId(null);
                        setMarksInput({});
                        setFeedbackInput({});
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className='btn btn-update btn-sm'
                    onClick={() => handleEdit(s.id, s.marks, s.feedback)}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}