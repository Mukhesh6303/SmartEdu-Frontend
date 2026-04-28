import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export const ManageAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/assignments`)
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error(err));
  }, []);

  const deleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      fetch(`${API_URL}/api/assignments/${id}`, { method: 'DELETE' })
        .then(() => setAssignments(assignments.filter(a => a.id !== id)));
    }
  };

  return (
    <div className='manage-assignments-container'>
      <div className='page-header-with-button'>
        <div>
          <h1>Manage Assignments</h1>
          <p>View and manage all assignments</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-assignment')} 
          className='btn btn-primary btn-lg'
        >
          + Create New Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📋</div>
          <h2>No Assignments Yet</h2>
          <p>Create your first assignment to get started</p>
          <button 
            onClick={() => navigate('/admin/create-assignment')}
            className='btn btn-primary'
          >
            Create Assignment
          </button>
        </div>
      ) : (
        <div className='assignments-table'>
          <div className='table-header'>
            <div className='col-assignment-title'>Assignment Title</div>
            <div className='col-assignment-course'>Course</div>
            <div className='col-assignment-due'>Due Date</div>
            <div className='col-assignment-marks'>Max Marks</div>
            <div className='col-assignment-actions'>Actions</div>
          </div>
          {assignments.map((a) => (
            <div key={a.id} className='table-row'>
              <div className='col-assignment-title'>
                <span className='assignment-icon'>📋</span>
                {a.title}
              </div>
              <div className='col-assignment-course'>{a.course}</div>
              <div className='col-assignment-due'>
                {new Date(a.dueDate).toLocaleDateString()}
              </div>
              <div className='col-assignment-marks'>
                <span className='marks-badge'>{a.maxMarks}</span>
              </div>
              <div className='col-assignment-actions'>
                <button 
                  className='btn btn-danger btn-sm'
                  onClick={() => deleteAssignment(a.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
