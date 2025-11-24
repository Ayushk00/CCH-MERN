import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utility/AuthContext';
import ProtectedRoute from './utility/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/student/Dashboard';
import ActiveJobs from './pages/student/ActiveJobs';
import AppliedJobs from './pages/student/AppliedJobs';
import Settings from './pages/student/Settings';
import CompleteProfile from './pages/student/CompleteProfile';
import Student from './pages/student/Student';
import CDashboard from './pages/company/CDashboard';
import Company from './pages/company/Company';
import  CUpdate  from './pages/company/CUpdate';
import  CPostdrives from './pages/company/CPostdrives';
import CDriveapplication from './pages/company/CDriveapplication';
import { CSettings } from './pages/company/CSettings';
import Admin from './pages/admin/Admin';
import ADashboard from './pages/admin/ADashboard';
import Adminactivedrive from './pages/admin/Adminactivedrive';
import Companies from './pages/admin/Companies';
import Studentprofile from './pages/admin/Studentprofile';
import EditProfile from './pages/student/EditProfile';
import { CCurrentdrives } from './pages/company/CCurrentdrives';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute roles={['student']}/>}>
          <Route path = "/student" element={<Student />}>
              <Route index element={<Dashboard />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="active-jobs" element={<ActiveJobs />} />
              <Route path="applied-jobs" element={<AppliedJobs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="complete-profile" element={<CompleteProfile />} />
            </Route>
          </Route> 
          <Route element={<ProtectedRoute roles={['company']}/>}>
          <Route path = "/company" element={<Company />}>
              <Route index element={<CDashboard/>} />
              {/* <Route path="edit-profile" element={<EditProfile />} /> */}
              <Route path="update-profile" element={<CUpdate/>} />
              <Route path="post-drive" element={<CPostdrives />} />
              <Route path="current-drives" element={<CCurrentdrives />} />
              <Route path="drive-application" element={<CDriveapplication />} />
              <Route path="settings" element={<CSettings />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute roles={['admin']}/>}>
          <Route path = "/admin" element={<Admin/>}>
              <Route index element={<ADashboard/>} />
              {/* <Route path="edit-profile" element={<EditProfile />} /> */}
              <Route path="active-drives" element={<Adminactivedrive/>} />
              <Route path="companies" element={<Companies/>} />
              <Route path="student" element={<Studentprofile />} />
            </Route>
          </Route>   
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;