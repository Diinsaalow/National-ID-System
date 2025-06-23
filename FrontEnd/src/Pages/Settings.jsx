import React, { useState, useEffect } from 'react'
import { FaUserPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Reviewer',
  })
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users')
      setUsers(res.data)
    } catch (error) {
      toast.error('❌ Failed to load users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await axios.put(`/api/users/${editId}`, formData)
        toast.success('User updated successfully')
        setIsEditing(false)
        setEditId(null)
      } else {
        await axios.post('/api/users', formData)
        toast.success(`${formData.role} added successfully`)
        // ✅ Mark flag to refresh Home stats
        localStorage.setItem('refreshStats', 'true')
      }
      setFormData({ fullName: '', email: '', role: 'Reviewer' })
      fetchUsers()
    } catch (err) {
      toast.error('❌ Error saving user')
    }
  }

  const handleEdit = (user) => {
    setFormData({ fullName: user.fullName, email: user.email, role: user.role })
    setIsEditing(true)
    setEditId(user._id)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    )
    if (!confirmDelete) return
    try {
      await axios.delete(`/api/users/${id}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (err) {
      toast.error('❌ Error deleting user')
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <ToastContainer position='top-right' autoClose={3000} />
      <div className='max-w-5xl mx-auto'>
        <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
          <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
            <FaUserPlus /> {isEditing ? 'Update User' : 'Add New User'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-3 gap-4'
          >
            <input
              type='text'
              name='fullName'
              placeholder='Full Name'
              value={formData.fullName}
              onChange={handleChange}
              className='p-3 border rounded-xl'
              required
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className='p-3 border rounded-xl'
              required
            />
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='p-3 border rounded-xl'
              required
            >
              <option value='Admin'>Total Admins</option>
              <option value='Reviewer'>Total Reviewers</option>
              <option value='Birth Recorder'>Birth Recorder</option>
              <option value='ID Card Recorder'>ID Card Recorder</option>
              <option value='Death Recorder'>Death Recorder</option>
            </select>
            <div className='md:col-span-3 flex justify-end'>
              <button
                type='submit'
                className='bg-blue-600 text-white px-6 py-3 rounded-xl'
              >
                {isEditing ? 'Update User' : 'Save User'}
              </button>
            </div>
          </form>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-md overflow-x-auto'>
          <h2 className='text-xl font-semibold mb-4'>User List</h2>
          <table className='min-w-full table-auto text-sm'>
            <thead>
              <tr className='bg-gray-100 text-gray-700 text-left'>
                <th className='p-3'>#</th>
                <th className='p-3'>Full Name</th>
                <th className='p-3'>Email</th>
                <th className='p-3'>Role</th>
                <th className='p-3 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className='border-t hover:bg-gray-50'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{user.fullName}</td>
                  <td className='p-3'>{user.email}</td>
                  <td className='p-3'>{user.role}</td>
                  <td className='p-3 text-center'>
                    <div className='flex justify-center gap-2'>
                      <button
                        onClick={() => handleEdit(user)}
                        className='bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md flex items-center gap-1'
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1'
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Settings
