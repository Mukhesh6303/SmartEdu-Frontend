import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    code: '',
    description: '',
    duration: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course.name || !course.code || !course.description || !course.duration) {
      alert('Please fill in all fields');
      return;
    }
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    localStorage.setItem(
      'courses',
      JSON.stringify([...courses, { ...course, id: Date.now() }])
    );
    alert('Course Created Successfully');
    setCourse({ name: '', code: '', description: '', duration: '' });
    navigate('/admin');
  };

  return (
    <div className='create-course-container'>
      <div className='page-header'>
        <h1>Create New Course</h1>
        <p>Add a new course to the system</p>
      </div>

      <div className='form-card'>
        <div className='form-card-header'>
          <div className='form-card-icon'>📚</div>
          <div>
            <h2>Course Information</h2>
            <p>Fill in the course details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='course-form'>
          <div className='form-group'>
            <label>Course Name</label>
            <input
              type='text'
              value={course.name}
              placeholder='e.g., Introduction to React'
              onChange={e => setCourse({ ...course, name: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label>Course Code</label>
            <input
              type='text'
              value={course.code}
              placeholder='e.g., CS101'
              onChange={e => setCourse({ ...course, code: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label>Description</label>
            <textarea
              value={course.description}
              placeholder='Describe the course content and objectives'
              onChange={e => setCourse({ ...course, description: e.target.value })}
              rows='4'
              required
            />
          </div>

          <div className='form-group'>
            <label>Duration (in weeks)</label>
            <input
              type='number'
              value={course.duration}
              placeholder='e.g., 8'
              onChange={e => setCourse({ ...course, duration: e.target.value })}
              required
            />
          </div>

          <div className='form-actions'>
            <button type='submit' className='btn btn-primary btn-lg'>Create Course</button>
            <button type='button' onClick={() => navigate('/admin')} className='btn btn-secondary btn-lg'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}