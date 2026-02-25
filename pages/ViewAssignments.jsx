import { useEffect, useState } from 'react';

export default function ViewAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [marksInput, setMarksInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState({});
  const [viewingFiles, setViewingFiles] = useState(null);

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

  const openFilesModal = (submission) => {
    setViewingFiles(submission);
  };

  const closeFilesModal = () => {
    setViewingFiles(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
            <div className='col-files'>Files</div>
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
              <div className='col-files'>
                {s.files && s.files.length > 0 ? (
                  <button 
                    className='btn btn-files btn-sm'
                    onClick={() => openFilesModal(s)}
                  >
                    📎 {s.files.length} file{s.files.length > 1 ? 's' : ''}
                  </button>
                ) : (
                  <span className='no-files-text'>No files</span>
                )}
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

      {viewingFiles && (
        <div className='modal-overlay' onClick={closeFilesModal}>
          <div className='modal-content files-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <div>
                <h2>Submitted Files</h2>
                <p className='modal-subtitle'>
                  {viewingFiles.title} - {viewingFiles.studentName}
                </p>
              </div>
              <button className='modal-close' onClick={closeFilesModal}>×</button>
            </div>

            <div className='modal-body'>
              {viewingFiles.files && viewingFiles.files.length > 0 ? (
                <div className='files-list-modal'>
                  {viewingFiles.files.map((file, index) => (
                    <div key={index} className='file-item-modal'>
                      <div className='file-icon-large'>
                        {file.type === 'application/pdf' ? (
                          <div className='pdf-icon'>📄</div>
                        ) : (
                          <div className='image-icon'>🖼️</div>
                        )}
                      </div>
                      <div className='file-details-modal'>
                        <h4 className='file-name-modal'>{file.name}</h4>
                        <div className='file-meta'>
                          <span className='file-type'>{file.type === 'application/pdf' ? 'PDF Document' : 'JPG Image'}</span>
                          <span className='file-size-modal'>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='no-files-message'>
                  <div className='empty-icon'>📭</div>
                  <p>No files were submitted</p>
                </div>
              )}
              
              {viewingFiles.submissionNotes && (
                <div className='submission-notes-section'>
                  <h4>Student Notes:</h4>
                  <p className='notes-content'>{viewingFiles.submissionNotes}</p>
                </div>
              )}
            </div>

            <div className='modal-footer'>
              <button className='btn btn-secondary' onClick={closeFilesModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}