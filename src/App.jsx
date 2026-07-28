import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import JabatanList from './pages/Jabatan/JabatanList';
import MasterEmployee from './pages/Master/MasterEmployee';
import UserList from './pages/UserManagement/UserList';
import MasterUmk from './pages/Master/MasterUmk';
import MasterTer from './pages/Master/MasterTer';
import MasterPtkp from './pages/Master/MasterPtkp';
import MasterPkp from './pages/Master/MasterPkp';
import MasterClient from './pages/Master/MasterClient';
import MasterPicUk from './pages/Master/MasterPicUk';
import MasterPicProject from './pages/Master/MasterPicProject';
import Login from './pages/Login';
import { Typography, Box, Paper, Grid } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

import Dashboard from './pages/Dashboard/Dashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/user-management/user" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="/master/umk" element={<ProtectedRoute><MasterUmk /></ProtectedRoute>} />
        <Route path="/master/ter" element={<ProtectedRoute><MasterTer /></ProtectedRoute>} />
        <Route path="/master/ptkp" element={<ProtectedRoute><MasterPtkp /></ProtectedRoute>} />
        <Route path="/master/pkp" element={<ProtectedRoute><MasterPkp /></ProtectedRoute>} />
        <Route path="/master/employee" element={<ProtectedRoute><MasterEmployee /></ProtectedRoute>} />
        <Route path="/master/client" element={<ProtectedRoute><MasterClient /></ProtectedRoute>} />
        <Route path="/master/pic-uk" element={<ProtectedRoute><MasterPicUk /></ProtectedRoute>} />
        <Route path="/master/picproject" element={<ProtectedRoute><MasterPicProject /></ProtectedRoute>} />
        {/* Placeholder for other routes */}
        <Route path="*" element={<ProtectedRoute><Typography variant="h5">Module Under Development</Typography></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
