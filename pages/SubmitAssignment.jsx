import { useState, useEffect } from 'react';

export default function SubmitAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [editFiles, setEditFiles] = useState([]);
  const [showEditFilesModal, setShowEditFilesModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) return;

    Promise.all([
      fetch('http://localhost:8080/api/assignments').then(r => r.json()),
      fetch(`http://localhost:8080/api/enrollments/student/${user.email}`).then(r => r.json()),
      fetch('http://localhost:8080/api/courses').then(r => r.json()),
      fetch(`http://localhost:8080/api/submissions/student/${user.email}`).then(r => r.json())
    ]).then(([as, es, cs, ss]) => {
      const parsedAssignments = as.map(a => {
        let attachmentsArr = [];
        try {
          if (a.attachments) attachmentsArr = typeof a.attachments === 'string' ? JSON.parse(a.attachments) : a.attachments;
        } catch(e) {}
        return { ...a, attachments: attachmentsArr };
      });
      setAssignments(parsedAssignments);

      const enrolledObjects = cs.filter(c => es.find(e => e.courseId === c.id));
      setEnrolled(enrolledObjects);
      
      const parsedSubmissions = ss.map(s => {
        let filesArr = [];
        try { filesArr = s.files ? JSON.parse(s.files) : []; } catch(e) {}
        return {
          ...s,
          submissionId: s.id,
          id: s.assignmentId,
          files: filesArr
        };
      });
      setSubmissions(parsedSubmissions);
    }).catch(console.error);
  }, [refreshKey]);

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
    setSelectedFiles([]);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    const maxFiles = 2;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a PDF or JPG file`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const submit = async () => {
    if (!selectedAssignment) return;

    const alreadySubmitted = submissions.find(s => s.assignmentId === selectedAssignment.id || s.id === selectedAssignment.id);
    if (alreadySubmitted) {
      alert('You have already submitted this assignment');
      closeSubmitModal();
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Convert native files to base64 before sending to backend
    const filePromises = selectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const fileData = await Promise.all(filePromises);

      const newSubmission = {
        assignmentId: selectedAssignment.id,
        studentEmail: user.email,
        studentName: user.email,
        title: selectedAssignment.title,
        course: selectedAssignment.course,
        maxMarks: selectedAssignment.maxMarks,
        submittedAt: new Date().toISOString(),
        submissionNotes: '',
        files: JSON.stringify(fileData)
      };

      const res = await fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission)
      });
      
      if(res.ok) {
        alert('Assignment Submitted Successfully!');
        closeSubmitModal();
        setRefreshKey(k => k + 1);
      } else {
        alert('Failed to submit');
      }
    } catch(err) {
      console.error(err);
      alert('Failed to submit: ' + err.message);
    }
  };

  const startEdit = (submission) => {
    setEditingSubmissionId(submission.submissionId);
    setEditDescription(submission.submissionNotes || '');
    setEditFiles(submission.files || []);
    setShowEditFilesModal(true);
  };

  const closeEditFilesModal = () => {
    setShowEditFilesModal(false);
    setEditingSubmissionId(null);
    setEditFiles([]);
    setEditDescription('');
  };

  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddEditFiles(files);
  };

  const validateAndAddEditFiles = (files) => {
    const maxFiles = 2;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    
    if (editFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a PDF or JPG file`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newFileObjects = validFiles.map(f => ({ name: f.name, size: f.size, type: f.type, data: f.data }));
    setEditFiles([...editFiles, ...newFileObjects]);
  };

  const removeEditFile = (index) => {
    setEditFiles(editFiles.filter((_, i) => i !== index));
  };

  const saveEditedFiles = () => {
    const updatedSubmissions = submissions.map(s =>
      s.submissionId === editingSubmissionId
        ? { ...s, files: editFiles, submissionNotes: editDescription }
        : s
    );
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);
    closeEditFilesModal();
    alert('Submission updated successfully!');
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
                          {assignment.attachments && assignment.attachments.length > 0 && (
                            <div className='assignment-attachments'>
                              <strong>📎 Assignment Files:</strong>
                              <div className='attachments-list'>
                                {assignment.attachments.map((file, idx) => (
                                  <div key={idx} className='attachment-item'>
                                    <span className='attachment-icon'>
                                      {file.type === 'application/pdf' ? '📄' : '🖼️'}
                                    </span>
                                    <span className='attachment-name'>{file.name}</span>
                                    <span className='attachment-size'>({formatFileSize(file.size)})</span>
                                    {file.data && (
                                      <a href={file.data} download={file.name} className="download-btn" style={{marginLeft:'auto',color:'#3b82f6',textDecoration:'none',fontWeight:'500'}}>📥 Download</a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {submission?.feedback && (
                            <div className='instructor-feedback-box'>
                              <div className='feedback-header-box'>📝 Instructor Feedback</div>
                              <div className='feedback-message-box'>{submission.feedback}</div>
                            </div>
                          )}
                          <div className='assignment-meta'>
                            <span className='meta-item'>
                              📅 Due: {assignment.dueDate && !isNaN(new Date(assignment.dueDate).getTime()) ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                            </span>
                            <span className='meta-item'>
                              ⭐ Max Marks: {assignment.maxMarks}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => openSubmitModal(assignment)}
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
                      {submission.files && submission.files.length > 0 && (
                        <div className='submission-files-display'>
                          <strong>Attached Files:</strong>
                          <div className='files-preview'>
                            {submission.files.map((file, idx) => (
                              <div key={idx} className='file-preview-item'>
                                <span className='file-icon-small'>
                                  {file.type === 'application/pdf' ? '📄' : '🖼️'}
                                </span>
                                <span className='file-name-small'>{file.name}</span>
                                <span className='file-size-small'>({formatFileSize(file.size)})</span>
                                {file.data && (
                                  <a href={file.data} download={file.name} className="download-btn-small" style={{marginLeft:'auto',color:'#3b82f6',textDecoration:'none',fontWeight:'500',padding:'0 6px'}}>📥</a>
                                )}
                              </div>
                            ))}
                          </div>
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
                              EDIT
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

      {showSubmitModal && (
        <div className='modal-overlay' onClick={closeSubmitModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Add submission</h2>
              <button className='modal-close' onClick={closeSubmitModal}>×</button>
            </div>

            <div className='modal-body'>
              <div className='submission-info-box'>
                <h3>{selectedAssignment?.title}</h3>
                <p>{selectedAssignment?.description}</p>
              </div>

              <div className='file-submission-section'>
                <div className='section-label'>
                  File submissions
                  <span className='file-limits'>Maximum file size: 5 MB, maximum number of files: 2</span>
                </div>

                <div className='file-upload-area'>
                  <div className='file-upload-toolbar'>
                    <label className='file-input-label'>
                      <input
                        type='file'
                        onChange={handleFileSelect}
                        accept='.pdf,.jpg,.jpeg'
                        multiple
                        style={{ display: 'none' }}
                      />
                      <span className='toolbar-icon' title='Add files'>📄</span>
                    </label>
                    <span className='toolbar-icon' title='Create folder'>📁</span>
                    <span className='toolbar-icon' title='Delete'>🗑️</span>
                    <div className='view-toggle'>
                      <span 
                        className={`toolbar-icon ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title='Grid view'
                      >
                        ⊞
                      </span>
                      <span 
                        className={`toolbar-icon ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title='List view'
                      >
                        ☰
                      </span>
                      <span 
                        className={`toolbar-icon ${viewMode === 'detail' ? 'active' : ''}`}
                        onClick={() => setViewMode('detail')}
                        title='Detail view'
                      >
                        ≡
                      </span>
                    </div>
                  </div>

                  <div className='files-tree'>
                    <div className='folder-item'>
                      <span className='folder-icon'>▶ 📁</span> Files
                    </div>
                  </div>

                  <div
                    className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className='drop-zone-content'>
                      <div className='drop-icon'>⬇️</div>
                      <p>You can drag and drop files here to add them.</p>
                    </div>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className={`files-list ${viewMode}`}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className='file-item'>
                          <div className='file-info'>
                            <span className='file-icon'>
                              {file.type === 'application/pdf' ? '📄' : '🖼️'}
                            </span>
                            <div className='file-details'>
                              <span className='file-name'>{file.name}</span>
                              <span className='file-size'>{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                          <button 
                            className='remove-file-btn'
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <button className='btn btn-primary' onClick={submit}>
                Save changes
              </button>
              <button className='btn btn-secondary' onClick={closeSubmitModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditFilesModal && (
        <div className='modal-overlay' onClick={closeEditFilesModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Edit Submission</h2>
              <button className='modal-close' onClick={closeEditFilesModal}>×</button>
            </div>

            <div className='modal-body'>
              <div className='edit-section'>
                <label className='section-label'>Submission Notes:</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder='Add or update your submission notes...'
                  className='edit-textarea'
                  rows='4'
                />
              </div>

              <div className='file-submission-section'>
                <div className='section-label'>
                  Attached Files
                  <span className='file-limits'>Maximum file size: 5 MB, maximum number of files: 2</span>
                </div>

                <div className='file-upload-area'>
                  <div className='file-upload-toolbar'>
                    <label className='file-input-label'>
                      <input
                        type='file'
                        onChange={handleEditFileSelect}
                        accept='.pdf,.jpg,.jpeg'
                        multiple
                        style={{ display: 'none' }}
                      />
                      <span className='toolbar-icon' title='Add files'>📄</span>
                    </label>
                  </div>

                  {editFiles.length > 0 ? (
                    <div className='files-list list'>
                      {editFiles.map((file, index) => (
                        <div key={index} className='file-item'>
                          <div className='file-info'>
                            <span className='file-icon'>
                              {file.type === 'application/pdf' ? '📄' : '🖼️'}
                            </span>
                            <div className='file-details'>
                              <span className='file-name'>{file.name}</span>
                              <span className='file-size'>{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                          <button 
                            className='remove-file-btn'
                            onClick={() => removeEditFile(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='no-files-notice'>
                      <p>No files attached. Click the 📄 icon above to add files.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <button className='btn btn-primary' onClick={saveEditedFiles}>
                Save changes
              </button>
              <button className='btn btn-secondary' onClick={closeEditFilesModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}