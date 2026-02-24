import { useState, useEffect } from 'react';

export default function ManageStudents() {
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    setEnrolled(JSON.parse(localStorage.getItem('enrolled') || '[]'));
  }, []);

  return (
    <div className='manage-students-container'>
      <div className='page-header'>
        <h1>Manage Students</h1>
        <p>View and manage the list of students and their enrolled courses</p>
      </div>

      {enrolled.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>👨‍🎓</div>
          <h2>No Student Enrollments</h2>
          <p>Students will appear here when they enroll in courses</p>
        </div>
      ) : (
        <div className='enrollments-table'>
          <div className='table-header-row'>
            <div className='col-student-name'>Student Name/ID</div>
            <div className='col-enrolled-course'>Enrolled Course Name</div>
            <div className='col-course-code'>Course Code</div>
            <div className='col-duration'>Course Duration</div>
          </div>
          {enrolled.map((enrollment, index) => {
            const studentName = enrollment.studentName || enrollment.studentId || enrollment.studentEmail || `Student ${index + 1}`;
            const studentId = enrollment.studentId || enrollment.studentEmail || 'N/A';
            const courseName = enrollment.name || enrollment.title || 'Untitled Course';
            const courseCode = enrollment.code || 'N/A';
            const duration = enrollment.duration ? `${enrollment.duration} weeks` : 'N/A';

            return (
              <div key={enrollment.id || index} className='table-data-row'>
                <div className='col-student-name'>
                  <span className='student-icon'>👤</span>
                  <div className='student-details'>
                    <span className='student-name'>{studentName}</span>
                    <span className='student-id'>ID: {studentId}</span>
                  </div>
                </div>
                <div className='col-enrolled-course'>{courseName}</div>
                <div className='col-course-code'>{courseCode}</div>
                <div className='col-duration'>{duration}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}