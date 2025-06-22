// File: App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './Pages/LoginPage';
import Dashboard from './components/Dashboard';
import AllCitizenRecords from './Pages/AllCitizenRecords';
import Home from './Pages/Home';
import AddBirth from './Pages/AddBirth';
import AddID from './Pages/AddID';
import Pending from './Pages/Pending';
import Verified from './Pages/Verified';
import Rejected from './Pages/Rejected';
import Settings from './Pages/Settings';
import DeathRecords from './Pages/DeathRecords';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>                                                                  
          <Route path="/" element={<LoginPage />} />
          {/* <Route element={<ProtectedRoute />}> */}
            {/* Protected routes can be added here if needed */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="all-citizen-records" element={<AllCitizenRecords />} />
              <Route path="add-birth" element={<AddBirth />} />
              <Route path="add-id" element={<AddID />} />
              <Route path="pending" element={<Pending />} />
              <Route path="verified" element={<Verified />} />
              <Route path="rejected" element={<Rejected />} />
              <Route path="settings" element={<Settings />} />
              <Route path="death-records" element={<DeathRecords />} />
          </Route>
          {/* </Route> */}
        </Routes>
      </Router>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
