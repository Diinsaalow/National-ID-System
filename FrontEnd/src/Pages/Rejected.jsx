// File: src/pages/RejectedCases.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaTimesCircle, FaUserAlt, FaEnvelope } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RejectedCases() {
  const [rejected, setRejected] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadAllRejected = async () => {
      try {
        const [births, ids] = await Promise.all([
          axios.get('/api/births/rejected'),
          axios.get('/api/ids/rejected'),
        ])
        setRejected([...births.data, ...ids.data])
      } catch {
        toast.error(' Failed to load rejected records')
      }
    }
    loadAllRejected()
  }, [])

  const handleSendEmailClick = (user) => {
    setSelectedUser(user)
    setSubject(`Regarding Your ${user.type} Application`)
    setMessage(
      `Dear ${
        user.fullName
      },\n\nWe regret to inform you that your application for a ${
        user.type
      } was rejected due to the following reason:\n\n${
        user.reason || 'Not specified'
      }\n\nYou may reapply or contact the office for more details.\n\nThank you,\nNIRA Team`
    )
    setShowModal(true)
  }

  const handleSend = async () => {
    try {
      await axios.post('/api/notifications/send', {
        email: selectedUser.email,
        subject,
        message,
      })
      toast.success('📨 Email sent successfully!')
      setShowModal(false)
    } catch (err) {
      console.error(err)
      toast.error(' Failed to send email')
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <ToastContainer />
      <h2 className='text-2xl font-bold text-red-600 flex items-center gap-2 mb-4'>
        <FaTimesCircle /> Rejected Cases
      </h2>

      <div className='bg-white shadow-xl rounded-xl overflow-x-auto'>
        <table className='min-w-[800px] w-full text-sm'>
          <thead>
            <tr className='bg-red-100 text-red-800 text-left text-xs uppercase'>
              <th className='px-4 py-3'>#</th>
              <th className='px-4 py-3'>Name</th>
              <th className='px-4 py-3'>Type</th>
              <th className='px-4 py-3'>Reason</th>
              <th className='px-4 py-3'>Email</th>
              <th className='px-4 py-3 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {rejected.length === 0 ? (
              <tr>
                <td colSpan='6' className='text-center py-6 text-gray-500'>
                  No rejected cases
                </td>
              </tr>
            ) : (
              rejected.map((r, i) => (
                <tr key={r._id} className='border-b hover:bg-gray-50'>
                  <td className='px-4 py-3'>{i + 1}</td>
                  <td className='px-4 py-3 flex items-center gap-2 text-gray-800'>
                    <FaUserAlt /> {r.fullName}
                  </td>
                  <td className='px-4 py-3 font-medium text-blue-800'>
                    {r.type || 'N/A'}
                  </td>
                  <td className='px-4 py-3 text-gray-700'>
                    {r.reason || 'N/A'}
                  </td>
                  <td className='px-4 py-3 text-gray-600'>{r.email}</td>
                  <td className='px-4 py-3 text-center'>
                    <button
                      onClick={() => handleSendEmailClick(r)}
                      className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1'
                    >
                      <FaEnvelope /> Send Email
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white w-full max-w-lg p-6 rounded-xl shadow-xl'>
            <h3 className='text-xl font-bold text-red-600 mb-4'>
              Send Rejection Email
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
                onClick={handleSend}
                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
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

export default RejectedCases
