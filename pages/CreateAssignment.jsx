import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    maxMarks: ''
  });

  const courses = JSON.parse(localStorage.getItem('courses') || '[]');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignment.title || !assignment.course || !assignment.description || !assignment.dueDate || !assignment.maxMarks) {
      alert('Please fill in all fields');
      return;
    }
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    localStorage.setItem(
      'assignments',
      JSON.stringify([...assignments, { ...assignment, id: Date.now() }])
    );
    alert('Assignment Created Successfully!');
    setAssignment({ title: '', course: '', description: '', dueDate: '', maxMarks: '' });
    navigate('/admin');
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