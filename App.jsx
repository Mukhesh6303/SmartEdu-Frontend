import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import {AdminLayout} from './layouts/AdminLayout';
import {StudentLayout} from './layouts/StudentLayout';
import {AdminDashboard} from './pages/AdminDashboard';
import {StudentDashboard} from './pages/StudentDashboard';
import CreateCourse from './pages/CreateCourse';
import {ManageCourses} from './pages/ManageCourses';
import {ManageAssignments} from './pages/ManageAssignments';
import ManageStudents from './pages/ManageStudent';
import {EnrollCourses} from './pages/EnrollCourses';
import CreateAssignment from './pages/CreateAssignment';
import ViewAssignments from './pages/ViewAssignments';
import SubmitAssignment from './pages/SubmitAssignment';
import StudentGrades from './pages/StudentGrades';

function App(){
    // Backend integration active: no longer clearing local storage on start

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashboard/>}/>
          <Route path="create-course" element={<CreateCourse/>}/>
          <Route path="manage-courses" element={<ManageCourses/>}/>
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="manage-assignments" element={<ManageAssignments />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="view-submissions" element={<ViewAssignments />} />
        </Route>
        <Route path="/student" element={<StudentLayout/>}>
          <Route path="submit-assignment" element={<SubmitAssignment />} />
          <Route index element={<StudentDashboard/>}/>
          <Route path="enroll" element={<EnrollCourses/>}/>
          <Route path="grades" element={<StudentGrades />} />
        </Route>
        <Route path="/" element={<Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;