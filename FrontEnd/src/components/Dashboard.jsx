// File: Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome, FaBaby, FaIdCard, FaClock, FaCheckCircle,
  FaTimesCircle, FaCog, FaSignOutAlt, FaUserShield,
  FaBars, FaTimes
} from 'react-icons/fa';

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/dashboard/home', label: 'Home', icon: <FaHome /> },
    { to: '/dashboard/add-birth', label: 'Birth Certificate', icon: <FaBaby /> },
    { to: '/dashboard/add-id', label: '  ID Card Record', icon: <FaIdCard /> },
    { to: '/dashboard/AllCitizenRecords', label: 'AllCitizenRecords', icon: <FaIdCard /> },
    { to: '/dashboard/pending', label: 'Pending Requests', icon: <FaClock /> },
    { to: '/dashboard/verified', label: 'Verified Users', icon: <FaCheckCircle /> },
    { to: '/dashboard/rejected', label: 'Rejected Cases', icon: <FaTimesCircle /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <FaCog /> },
    { to: '/dashboard/DeathRecords', label: 'DeathRecords', icon: <FaHome /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Topbar for mobile toggle */}
      <div className="md:hidden flex justify-between items-center bg-blue-800 text-white p-4 fixed top-0 w-full z-50">
        <h1 className="text-xl font-bold">NIRA</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white p-4 pt-20 z-40 transform transition-transform duration-300 md:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
        <div className="text-3xl font-bold mb-2 text-center">NIRA</div>
        <div className="text-center mb-6">
          <FaUserShield className="text-5xl mx-auto text-white" />
        </div>

        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-green-700 ${location.pathname === link.to ? 'bg-green-700' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-2 hover:bg-red-600 px-3 py-2 rounded mt-4">
            <FaSignOutAlt /> Logout
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out pt-20 p-4 ${menuOpen && window.innerWidth < 768 ? 'hidden' : 'md:ml-64 block'}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
