import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const deleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      fetch(`${API_URL}/api/courses/${id}`, { method: 'DELETE' })
        .then(() => setCourses(courses.filter(c => c.id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className='manage-courses-container'>
      <div className='page-header-with-button'>
        <div>
          <h1>Manage Courses</h1>
          <p>View and manage all courses</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-course')} 
          className='btn btn-primary btn-lg'
        >
          + Create New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📖</div>
          <h2>No Courses Yet</h2>
          <p>Create your first course to get started</p>
          <button 
            onClick={() => navigate('/admin/create-course')}
            className='btn btn-primary'
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className='courses-grid'>
          {courses.map(course => (
            <div key={course.id} className='course-card'>
              <div className='course-header'>
                <h3>{course.name}</h3>
                <span className='course-code'>{course.code}</span>
              </div>
              <p className='course-description'>{course.description}</p>
              <div className='course-info'>
                <span className='course-duration'>📅 {course.duration} weeks</span>
              </div>
              <div className='course-actions'>
                <button className='btn btn-edit'>Edit</button>
                <button 
                  onClick={() => deleteCourse(course.id)}
                  className='btn btn-danger'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};