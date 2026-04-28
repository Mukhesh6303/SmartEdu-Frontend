import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    maxMarks: ''
  });
  const [attachedFiles, setAttachedFiles] = useState([]);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(console.error);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    
    if (attachedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a PDF or JPG file`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setAttachedFiles([...attachedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignment.title || !assignment.course || !assignment.description || !assignment.dueDate || !assignment.maxMarks) {
      alert('Please fill in all fields');
      return;
    }

    // Convert files to base64 for storage
    const filePromises = attachedFiles.map(file => {
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

    const fileData = await Promise.all(filePromises);

    const backendPayload = {
      ...assignment,
      attachments: JSON.stringify(fileData)
    };

    try {
      const response = await fetch(`${API_URL}/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendPayload)
      });
      
      if (response.ok) {
        alert('Assignment Created Successfully!');
        setAssignment({ title: '', course: '', description: '', dueDate: '', maxMarks: '' });
        setAttachedFiles([]);
        navigate('/admin/manage-assignments');
      } else {
        alert('Failed to create assignment');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className='create-assignment-container'>
      <div className='page-header'>
        <h1>Create Assignment</h1>
        <p>Add a new assignment for a course</p>
      </div>

      <div className='form-card'>
        <div className='form-card-header'>
          <div className='form-card-icon' style={{ backgroundColor: '#dcfce7' }}>📋</div>
          <div>
            <h2>Assignment Details</h2>
            <p>Fill in the assignment information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='assignment-form'>
          <div className='form-group'>
            <label>Assignment Title</label>
            <input
              type='text'
              placeholder='e.g., Week 1 - React Basics'
              value={assignment.title}
              onChange={e => setAssignment({ ...assignment, title: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label>Select Course</label>
            <select
              value={assignment.course}
              onChange={e => setAssignment({ ...assignment, course: e.target.value })}
              required
            >
              <option value=''>Choose a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label>Description</label>
            <textarea
              placeholder='Describe the assignment requirements'
              value={assignment.description}
              onChange={e => setAssignment({ ...assignment, description: e.target.value })}
              rows='4'
              required
            />
          </div>

          <div className='form-group'>
            <label>Attach Files (Optional)</label>
            <p className='field-hint'>Upload assignment files, question papers (PDF, JPG - Max 10MB per file, up to 5 files)</p>
            <div className='file-attachment-section'>
              <label className='file-upload-btn'>
                <input
                  type='file'
                  onChange={handleFileSelect}
                  accept='.pdf,.jpg,.jpeg'
                  multiple
                  style={{ display: 'none' }}
                />
                <span className='upload-icon'>📎</span>
                <span>Choose Files</span>
              </label>
              
              {attachedFiles.length > 0 && (
                <div className='attached-files-list'>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className='attached-file-item'>
                      <div className='file-info-attachment'>
                        <span className='file-icon-attach'>
                          {file.type === 'application/pdf' ? '📄' : '🖼️'}
                        </span>
                        <div className='file-details-attach'>
                          <span className='file-name-attach'>{file.name}</span>
                          <span className='file-size-attach'>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <button 
                        type='button'
                        className='remove-attachment-btn'
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

          <div className='form-row assignment-meta-row'>
            <div className='form-group'>
              <label>Due Date</label>
              <input
                type='date'
                value={assignment.dueDate}
                onChange={e => setAssignment({ ...assignment, dueDate: e.target.value })}
                required
              />
            </div>
            <div className='form-group'>
              <label>Maximum Marks</label>
              <input
                type='number'
                placeholder='100'
                value={assignment.maxMarks}
                onChange={e => setAssignment({ ...assignment, maxMarks: e.target.value })}
                required
              />
            </div>
          </div>

          <div className='form-actions'>
            <button type='submit' className='btn btn-primary btn-lg'>Create Assignment</button>
            <button type='button' onClick={() => navigate('/admin')} className='btn btn-secondary btn-lg'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}