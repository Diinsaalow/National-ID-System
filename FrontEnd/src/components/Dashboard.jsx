// File: Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaHome,
  FaBaby,
  FaIdCard,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
  FaBars,
  FaTimes,
  FaUser,
} from 'react-icons/fa'

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    {
      to: '/dashboard/add-birth',
      label: 'Birth Certificate',
      icon: <FaBaby />,
    },
    { to: '/dashboard/add-id', label: '  ID Card Record', icon: <FaIdCard /> },
    {
      to: '/dashboard/all-citizen-records',
      label: 'All Citizen Records',
      icon: <FaIdCard />,
    },
    { to: '/dashboard/pending', label: 'Pending Requests', icon: <FaClock /> },
    {
      to: '/dashboard/verified',
      label: 'Verified Users',
      icon: <FaCheckCircle />,
    },
    {
      to: '/dashboard/rejected',
      label: 'Rejected Cases',
      icon: <FaTimesCircle />,
    },
    { to: '/dashboard/settings', label: 'Settings', icon: <FaCog /> },
    {
      to: '/dashboard/death-records',
      label: 'Death Records',
      icon: <FaHome />,
    },
    { to: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
  ]

  return (
    <div className='min-h-screen bg-gray-100 relative'>
      {/* Topbar for mobile toggle */}
      <div className='md:hidden flex justify-between items-center bg-blue-800 text-white p-4 fixed top-0 w-full z-50'>
        <h1 className='text-xl font-bold'>NIRA</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className='text-2xl'>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white p-4  z-40 transform transition-transform duration-300 md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block`}
      >
        <div className='text-3xl font-bold mb-2 text-center'>NIRA</div>

        {/* User Info */}
        <div className='text-center mb-6 p-3 bg-blue-700 rounded-lg'>
          <FaUser className='text-3xl mx-auto mb-2 text-blue-200' />
          <div className='text-sm font-semibold'>
            {user?.fullName || 'User'}
          </div>
          <div className='text-xs text-blue-200'>{user?.role || 'Role'}</div>
          <div className='text-xs text-blue-300'>
            {user?.email || 'email@example.com'}
          </div>
        </div>

        <nav className='space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 sidebar-scrollbar  pb-12'>
          {' '}
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-green-700 transition-colors duration-200 ${
                location.pathname === link.to ? 'bg-green-700' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 hover:bg-red-600 px-3 py-2 rounded mt-4 w-full text-left transition-colors duration-200'
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out pt-20 p-4 ${
          menuOpen && window.innerWidth < 768 ? 'hidden' : 'md:ml-64 block'
        }`}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
