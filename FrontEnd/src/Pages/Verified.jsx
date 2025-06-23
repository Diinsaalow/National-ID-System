// File: src/pages/VerifiedUsers.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaCheckCircle, FaUser, FaEnvelope } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function VerifiedUsers() {
  const [verifiedUsers, setVerifiedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchVerified = async () => {
      try {
        const [birthRes, idRes] = await Promise.all([
          axios.get('/api/births?status=approved'),
          axios.get('/api/ids?status=approved'),
        ])
        setVerifiedUsers([...birthRes.data, ...idRes.data])
        setLoading(false)
      } catch (err) {
        console.error(err)
        toast.error('❌ Failed to load verified users')
        setLoading(false)
      }
    }
    fetchVerified()
  }, [])

  const openModal = (user) => {
    setSelectedUser(user)
    setSubject(`Congratulations - Your ${user.type} has been approved!`)
    setMessage(
      `Dear ${user.fullName},\n\nWe are pleased to inform you that your ${user.type} request has been approved.\n\nThank you for using NIRA System.\n\nBest regards,\nNIRA Team`
    )
    setShowModal(true)
  }

  const sendEmail = async () => {
    try {
      await axios.post('/api/send-email', {
        to: selectedUser.email,
        subject: subject,
        message: message,
      })
      toast.success(`✅ Email sent to ${selectedUser.fullName}`)
      setShowModal(false)
    } catch (error) {
      console.error(error)
      toast.error('❌ Failed to send email')
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <ToastContainer />
      <div className='flex flex-col sm:flex-row justify-between items-center gap-6 mb-8'>
        <div className='flex items-center gap-3 text-green-700'>
          <FaCheckCircle className='text-3xl' />
          <h1 className='text-3xl font-bold'>Verified Users</h1>
        </div>
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4bgPpjBzbj9LDcqblFHAc-E-v9N14TkPvuA&s'
          alt='Verified'
          className='w-20 h-20 rounded-full border-4 border-green-300 shadow-md'
        />
      </div>

      <div className='overflow-x-auto bg-white shadow-2xl rounded-xl'>
        {loading ? (
          <div className='p-10 text-center text-gray-500 text-lg font-medium'>
            ⏳ Loading verified users...
          </div>
        ) : (
          <table className='min-w-[1000px] w-full text-sm sm:text-base'>
            <thead className='bg-green-100 text-green-800 uppercase text-sm'>
              <tr>
                <th className='px-4 py-3 text-left'>#</th>
                <th className='px-4 py-3 text-left'>Name</th>
                <th className='px-4 py-3 text-left'>Certificate Type</th>
                <th className='px-4 py-3 text-left'>Gender</th>
                <th className='px-4 py-3 text-left'>Email</th>
                <th className='px-4 py-3 text-left'>Approved On</th>
                <th className='px-4 py-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan='7'
                    className='text-center py-8 text-gray-500 font-medium'
                  >
                    No verified users found.
                  </td>
                </tr>
              ) : (
                verifiedUsers.map((user, index) => (
                  <tr key={user._id} className='hover:bg-gray-50 border-t'>
                    <td className='px-4 py-3'>{index + 1}</td>
                    <td className='px-4 py-3 flex items-center gap-2 text-gray-800 font-semibold'>
                      <FaUser className='text-green-600' /> {user.fullName}
                    </td>
                    <td className='px-4 py-3 text-blue-700 font-medium'>
                      {user.type || 'N/A'}
                    </td>
                    <td className='px-4 py-3'>{user.gender}</td>
                    <td className='px-4 py-3 text-sm text-gray-700'>
                      {user.email}
                    </td>
                    <td className='px-4 py-3 text-gray-500'>
                      {new Date(
                        user.updatedAt || user.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-3'>
                      <button
                        onClick={() => openModal(user)}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition duration-200'
                      >
                        <FaEnvelope /> Send Email
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white w-full max-w-lg p-6 rounded-xl shadow-xl'>
            <h3 className='text-xl font-bold text-green-600 mb-4'>
              Send Congratulations Email
            </h3>
            <label className='block text-sm font-medium mb-1'>To</label>
            <input
              value={selectedUser.email}
              readOnly
              className='w-full border p-2 rounded bg-gray-100'
            />
            <label className='block mt-4 text-sm font-medium mb-1'>
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className='w-full border p-2 rounded'
            />
            <label className='block mt-4 text-sm font-medium mb-1'>
              Message
            </label>
            <textarea
              rows='6'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='w-full border p-2 rounded'
            ></textarea>
            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setShowModal(false)}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded'
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifiedUsers
