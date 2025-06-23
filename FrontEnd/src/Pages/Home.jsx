import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FaBaby,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaSkullCrossbones,
  FaUserFriends,
  FaUserPlus,
  FaBell,
  FaUserShield,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'

function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const username = 'Admin'

  const [stats, setStats] = useState({
    birthRecords: 0,
    idRecords: 0,
    verifiedUsers: 0,
    rejectedCases: 0,
    deathRecords: 0,
    todaysIDRequests: 0,
    todaysDeathRequests: 0,
    docsAwaitingApproval: 0,
    docsAboutToExpire: 0,
    newUsersToday: 0,
    totalAdmins: 0,
    totalReviewers: 0,
    total: 0,
    male: 0,
    female: 0,
    todaysBirthRequests: 0,
  })

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/users/stats')
      setStats((prev) => ({
        ...prev,
        newUsersToday: res.data.newUsersToday,
        totalAdmins: res.data.totalAdmins,
        totalReviewers: res.data.totalReviewers,
        total: res.data.totalUsers,
        birthRecords: res.data.birthRecords || 0,
        male: res.data.male || 0,
        female: res.data.female || 0,
        todaysBirthRequests: res.data.todaysBirthRequests || 0,
      }))
    } catch (err) {
      console.error(' Error fetching stats:', err)
    }
  }

  useEffect(() => {
    fetchStats()
    const listener = () => fetchStats()
    window.addEventListener('birth-record-added', listener)
    return () => window.removeEventListener('birth-record-added', listener)
  }, [])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const statisticsCards = [
    {
      title: 'Birth Records',
      count: stats.birthRecords,
      icon: <FaBaby className='text-3xl text-green-400' />,
      bg: 'bg-green-800',
    },
    {
      title: 'Total Citizens Registered',
      count: stats.total,
      icon: <FaUserFriends className='text-3xl text-yellow-400' />,
      bg: 'bg-yellow-900',
    },
    {
      title: 'Male Citizens',
      count: stats.male,
      icon: <FaUserFriends className='text-3xl text-blue-300' />,
      bg: 'bg-blue-800',
    },
    {
      title: 'Female Citizens',
      count: stats.female,
      icon: <FaUserFriends className='text-3xl text-pink-300' />,
      bg: 'bg-pink-800',
    },
    {
      title: "Today's Birth Requests",
      count: stats.todaysBirthRequests,
      icon: <FaBaby className='text-3xl text-green-400' />,
      bg: 'bg-green-800',
    },
    // 👉 keep your other cards below here as they were...
    {
      title: 'ID Records',
      count: stats.idRecords,
      icon: <FaIdCard className='text-3xl text-yellow-400' />,
      bg: 'bg-yellow-900',
    },
    {
      title: 'Verified Users',
      count: stats.verifiedUsers,
      icon: <FaCheckCircle className='text-3xl text-blue-400' />,
      bg: 'bg-blue-800',
    },
    {
      title: 'Rejected Cases',
      count: stats.rejectedCases,
      icon: <FaTimesCircle className='text-3xl text-red-400' />,
      bg: 'bg-red-800',
    },
    {
      title: 'Death Records',
      count: stats.deathRecords,
      icon: <FaSkullCrossbones className='text-3xl text-gray-400' />,
      bg: 'bg-gray-800',
    },
    {
      title: "Today's ID Requests",
      count: stats.todaysIDRequests,
      icon: <FaIdCard className='text-3xl text-yellow-300' />,
      bg: 'bg-yellow-700',
    },
    {
      title: "Today's Death Requests",
      count: stats.todaysDeathRequests,
      icon: <FaSkullCrossbones className='text-3xl text-gray-300' />,
      bg: 'bg-gray-700',
    },
    {
      title: 'Documents Awaiting Approval',
      count: stats.docsAwaitingApproval,
      icon: <FaBell className='text-3xl text-orange-400' />,
      bg: 'bg-orange-800',
    },
    {
      title: 'Documents About to Expire',
      count: stats.docsAboutToExpire,
      icon: <FaBell className='text-3xl text-red-300' />,
      bg: 'bg-red-700',
    },
    {
      title: 'New Users Today',
      count: stats.newUsersToday,
      icon: <FaUserPlus className='text-3xl text-green-300' />,
      bg: 'bg-green-700',
    },
    {
      title: 'Total Admins',
      count: stats.totalAdmins,
      icon: <FaUserShield className='text-3xl text-purple-400' />,
      bg: 'bg-purple-800',
    },
    {
      title: 'Total Reviewers',
      count: stats.totalReviewers,
      icon: <FaUserShield className='text-3xl text-indigo-400' />,
      bg: 'bg-indigo-800',
    },
  ]

  const animatedTitles = [
    'Birth Records',
    'Total Citizens Registered',
    'Male Citizens',
    'Female Citizens',
    "Today's Birth Requests",
    'New Users Today',
    'Total Admins',
    'Total Reviewers',
  ]

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      } transition duration-500 min-h-screen w-full`}
    >
      <div className='pt-10 px-4 h-full overflow-y-auto'>
        <div className='flex justify-end mb-4'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className='flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm font-semibold bg-gray-700 text-white hover:bg-gray-600 transition'
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6'
        >
          <h1 className='text-3xl font-bold text-green-400'>
            Welcome, {username} 👋
          </h1>
          <p className='mt-1 text-sm text-gray-400'>
            Here is a quick overview of the NIRA system.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10'>
          {statisticsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateY: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              whileHover={{
                rotateY: 5,
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300 },
              }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl p-5 flex items-center gap-4 transform transition-all duration-300 cursor-pointer ${stat.bg} hover:shadow-2xl`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className='p-3 bg-black bg-opacity-20 rounded-full shadow-inner'>
                {stat.icon}
              </div>
              <div>
                <p className='text-sm font-medium text-gray-300'>
                  {stat.title}
                </p>
                <p className='text-2xl font-bold text-white'>
                  {animatedTitles.includes(stat.title) ? (
                    <CountUp end={stat.count} duration={2} separator=',' />
                  ) : (
                    stat.count
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className='text-center py-6 text-gray-500 text-sm'
        >
          Developed by{' '}
          <span className='text-green-400 font-semibold'>
            En-Sadam Hussein Mohamed
          </span>{' '}
          &copy; {new Date().getFullYear()}
        </motion.div>
      </div>
    </div>
  )
}

export default Home
