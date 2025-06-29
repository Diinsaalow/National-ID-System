// File: src/components/DeathRecords.jsx
import React, { useState, useEffect } from 'react'
import { FaSkullCrossbones, FaTrashAlt, FaEdit } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useApi } from '../hooks/useApi'

function DeathRecords({ onUpdateStats }) {
  const [deathRecords, setDeathRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    serialNumber: '',
    name: '',
    gender: '',
    dateOfDeath: '',
    location: '',
    reason: '',
  })

  const [editingId, setEditingId] = useState(null)

  const { get, post, put, delete: del } = useApi()
  const API_BASE_URL = 'http://localhost:5000/api/deaths'

  // Fetch all death records
  const fetchDeathRecords = async () => {
    try {
      setLoading(true)
      const response = await get(API_BASE_URL)
      if (response.success) {
        setDeathRecords(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch death records')
      }
    } catch (error) {
      toast.error('Failed to fetch death records')
    } finally {
      setLoading(false)
    }
  }

  // Fetch today's death records for stats
  const fetchTodayDeathRecords = async () => {
    try {
      const response = await get(`${API_BASE_URL}/today`)
      if (response.success) {
        return response.data.length
      }
      return 0
    } catch (error) {
      return 0
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchDeathRecords()
  }, [])

  // Update stats when death records change
  useEffect(() => {
    const updateStats = async () => {
      const todaysDeaths = await fetchTodayDeathRecords()
      onUpdateStats?.({
        deathRecords: deathRecords.length,
        todaysDeathRequests: todaysDeaths,
      })
    }
    updateStats()
  }, [deathRecords])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        // Update existing record
        const response = await put(`${API_BASE_URL}/${editingId}`, formData)
        if (response.success) {
          setDeathRecords((prev) =>
            prev.map((record) =>
              record._id === editingId ? response.data.data : record
            )
          )
          toast.success('Record updated successfully')
          setEditingId(null)
        } else {
          toast.error(response.message || 'Failed to update record')
        }
      } else {
        // Create new record
        const response = await post(API_BASE_URL, formData)
        if (response.success) {
          setDeathRecords((prev) => [response.data.data, ...prev])
          toast.success('Record added successfully')
        } else {
          toast.error(response.message || 'Failed to add record')
        }
      }

      // Reset form
      setFormData({
        serialNumber: '',
        name: '',
        gender: '',
        dateOfDeath: '',
        location: '',
        reason: '',
      })
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (record) => {
    setFormData({
      serialNumber: record.serialNumber,
      name: record.name,
      gender: record.gender,
      dateOfDeath: record.dateOfDeath.split('T')[0], // Convert to YYYY-MM-DD format
      location: record.location,
      reason: record.reason,
    })
    setEditingId(record._id)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Ma hubtaa inaad tirtirayso diiwaankan?')
    if (confirmed) {
      try {
        const response = await del(`${API_BASE_URL}/${id}`)
        if (response.success) {
          setDeathRecords((prev) => prev.filter((record) => record._id !== id))
          toast.success('Record deleted successfully')
        } else {
          toast.error(response.message || 'Failed to delete record')
        }
      } catch (error) {
        toast.error('Failed to delete record')
      }
    }
  }

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto p-6 flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading death records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-10 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-xl'>
      <ToastContainer position='top-right' autoClose={3000} />

      <div className='flex items-center justify-between'>
        <h2 className='text-4xl font-extrabold flex items-center gap-3 text-red-700'>
          <FaSkullCrossbones className='text-5xl' /> Death Records
        </h2>
        <img
          src='https://ih1.redbubble.net/image.142145982.5575/st,small,507x507-pad,600x600,f8f8f8.u2.jpg'
          alt='Jamhuuria Somali'
          className='w-16 h-16 rounded-full shadow-lg border-2 border-red-400'
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md space-y-4 animate-fade-in'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <input
            type='text'
            name='serialNumber'
            placeholder='Serial Number'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.serialNumber}
            onChange={handleChange}
            required
            disabled={!!editingId || submitting}
          />
          <input
            type='text'
            name='name'
            placeholder='Full Name'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
          <select
            name='gender'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.gender}
            onChange={handleChange}
            required
            disabled={submitting}
          >
            <option value=''>Select Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
          <input
            type='date'
            name='dateOfDeath'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.dateOfDeath}
            onChange={handleChange}
            required
            disabled={submitting}
          />
          <input
            type='text'
            name='location'
            placeholder='Location'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.location}
            onChange={handleChange}
            required
            disabled={submitting}
          />
          <input
            type='text'
            name='reason'
            placeholder='Reason of Death'
            className='p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400'
            value={formData.reason}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <button
          type='submit'
          disabled={submitting}
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold shadow transition duration-200 ${
            editingId
              ? 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
          } text-white disabled:cursor-not-allowed`}
        >
          {submitting
            ? 'Processing...'
            : editingId
            ? 'Update Record'
            : 'Add Record'}
        </button>
      </form>

      {/* Table */}
      <div className='bg-white shadow rounded-lg overflow-x-auto'>
        <table className='min-w-full table-auto text-sm text-gray-700'>
          <thead>
            <tr className='bg-red-200 text-red-800'>
              <th className='px-4 py-3 text-left'>#</th>
              <th className='px-4 py-3 text-left'>Name</th>
              <th className='px-4 py-3 text-left'>Gender</th>
              <th className='px-4 py-3 text-left'>Date</th>
              <th className='px-4 py-3 text-left'>Location</th>
              <th className='px-4 py-3 text-left'>Reason</th>
              <th className='px-4 py-3 text-left'>Serial #</th>
              <th className='px-4 py-3 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deathRecords.length === 0 ? (
              <tr>
                <td colSpan='8' className='px-4 py-8 text-center text-gray-500'>
                  No death records found
                </td>
              </tr>
            ) : (
              deathRecords.map((record, index) => (
                <tr
                  key={record._id}
                  className='border-b hover:bg-gray-50 transition'
                >
                  <td className='px-4 py-3'>{index + 1}</td>
                  <td className='px-4 py-3 font-medium'>{record.name}</td>
                  <td className='px-4 py-3'>{record.gender}</td>
                  <td className='px-4 py-3'>
                    {new Date(record.dateOfDeath).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3'>{record.location}</td>
                  <td className='px-4 py-3'>{record.reason}</td>
                  <td className='px-4 py-3'>{record.serialNumber}</td>
                  <td className='px-4 py-3 flex gap-3 items-center'>
                    <button
                      onClick={() => handleEdit(record)}
                      className='text-yellow-600 hover:text-yellow-800 text-lg'
                      disabled={submitting}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className='text-red-600 hover:text-red-800 text-lg'
                      disabled={submitting}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DeathRecords
