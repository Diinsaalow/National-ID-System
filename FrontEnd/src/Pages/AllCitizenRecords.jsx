import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllCitizenRecords = () => {
  const [citizens, setCitizens] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCitizen, setSelectedCitizen] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [citizenToDelete, setCitizenToDelete] = useState(null)
  const [citizenToEdit, setCitizenToEdit] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const recordsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Use the new combined endpoint
        console.log('Fetching data from /api/all...')
        const response = await axios.get('/api/all')
        console.log('API Response:', response.data)
        console.log('Number of records:', response.data.length)
        console.log(
          'Record types:',
          response.data.map((record) => record.type)
        )
        setCitizens(response.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch citizen records. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const term = searchTerm.toLowerCase()
  const filteredCitizens = citizens.filter((citizen) =>
    Object.values(citizen).some((val) =>
      String(val).toLowerCase().includes(term)
    )
  )

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredCitizens.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  )
  const totalPages = Math.ceil(filteredCitizens.length / recordsPerPage)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Simplified headers with only the most important fields
  const headers = [
    'ID Number',
    'Full Name',
    'Date of Birth',
    'Gender',
    'Type',
    'Actions',
  ]

  const handleViewCitizen = (citizen) => {
    setSelectedCitizen(citizen)
    setShowModal(true)
  }

  const handleEditCitizen = (citizen) => {
    setCitizenToEdit(citizen)
    setEditFormData({
      fullName: citizen.fullName,
      dob: citizen.dob || citizen.dateOfBirth,
      gender: citizen.gender,
      placeOfBirth: citizen.placeOfBirth,
      nationality: citizen.nationality,
      parentSerial: citizen.parentSerial || citizen.parentSerialNumber,
      dateOfIssue: citizen.dateOfIssue,
      dateOfExpiry: citizen.dateOfExpiry,
      county: citizen.county,
      email: citizen.email,
    })
    setShowEditModal(true)
  }

  const handleDeleteCitizen = (citizen) => {
    setCitizenToDelete(citizen)
    setShowDeleteModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCitizen(null)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setCitizenToDelete(null)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setCitizenToEdit(null)
    setEditFormData({})
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `/api/${citizenToDelete._id}?type=${citizenToDelete.type}`
      )

      // Remove from local state
      setCitizens(
        citizens.filter((citizen) => citizen._id !== citizenToDelete._id)
      )

      toast.success('Citizen record deleted successfully')
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting citizen:', error)
      toast.error('Failed to delete citizen record')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/${citizenToEdit._id}`, {
        ...editFormData,
        type: citizenToEdit.type,
      })

      // Update local state
      setCitizens(
        citizens.map((citizen) =>
          citizen._id === citizenToEdit._id
            ? { ...citizen, ...editFormData }
            : citizen
        )
      )

      toast.success('Citizen record updated successfully')
      closeEditModal()
    } catch (error) {
      console.error('Error updating citizen:', error)
      toast.error('Failed to update citizen record')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-8 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading citizen records...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-8 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center'>
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-8 px-4 sm:px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-blue-800 drop-shadow-sm'>
            All Citizen Records
          </h1>
          <p className='text-sm text-gray-600'>
            NIRA - National Identification and Registration Authority
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Total Records: {citizens.length} | Showing:{' '}
            {filteredCitizens.length}
          </p>
        </div>

        <input
          type='text'
          placeholder='Search citizens...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {currentRecords.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-xl shadow-md'>
            <p className='text-gray-500 text-lg'>
              {searchTerm
                ? 'No citizens found matching your search.'
                : 'No citizen records available.'}
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto bg-white rounded-xl shadow-md'>
            <table className='min-w-full text-sm text-left text-gray-700'>
              <thead className='bg-blue-100 text-blue-800'>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className='px-4 py-3 font-semibold tracking-wide'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((citizen, index) => (
                  <tr key={index} className='hover:bg-blue-50 border-b'>
                    <td className='px-4 py-2'>
                      {citizen.idNumber || citizen.IDNumber}
                    </td>
                    <td className='px-4 py-2'>{citizen.fullName}</td>
                    <td className='px-4 py-2'>
                      {citizen.dob || citizen.dateOfBirth}
                    </td>
                    <td className='px-4 py-2'>{citizen.gender}</td>
                    <td className='px-4 py-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          citizen.type === 'ID Card'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {citizen.type || 'Birth'}
                      </span>
                    </td>
                    <td className='px-4 py-2'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleViewCitizen(citizen)}
                          className='text-blue-600 hover:text-blue-800 font-medium text-xs'
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditCitizen(citizen)}
                          className='text-green-600 hover:text-green-800 font-medium text-xs'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCitizen(citizen)}
                          className='text-red-600 hover:text-red-800 font-medium text-xs'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-6 gap-2 flex-wrap'>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-blue-100 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Citizen Details Modal */}
        {showModal && selectedCitizen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold text-blue-800'>
                    Citizen Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
                  >
                    ×
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Basic Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-blue-700 border-b pb-2'>
                      Basic Information
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          ID Number
                        </label>
                        <p className='text-gray-900 font-medium'>
                          {selectedCitizen.idNumber || selectedCitizen.IDNumber}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Full Name
                        </label>
                        <p className='text-gray-900 font-medium'>
                          {selectedCitizen.fullName}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Date of Birth
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.dob || selectedCitizen.dateOfBirth}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Gender
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.gender}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Place of Birth
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.placeOfBirth}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Nationality
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.nationality}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-blue-700 border-b pb-2'>
                      Document Information
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Document Type
                        </label>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedCitizen.type === 'ID Card'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {selectedCitizen.type || 'Birth Record'}
                        </span>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Parent Serial Number
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.parentSerial ||
                            selectedCitizen.parentSerialNumber}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Date of Issue
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.dateOfIssue}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Date of Expiry
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.dateOfExpiry}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          County
                        </label>
                        <p className='text-gray-900'>
                          {selectedCitizen.county}
                        </p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-600'>
                          Email
                        </label>
                        <p className='text-gray-900'>{selectedCitizen.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Section */}
                {selectedCitizen.photo && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-blue-700 border-b pb-2 mb-4'>
                      Photo
                    </h3>
                    <div className='flex justify-center'>
                      <img
                        src={selectedCitizen.photo}
                        alt={`${selectedCitizen.fullName}'s photo`}
                        className='w-32 h-32 object-cover rounded-lg border-2 border-gray-200'
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className='mt-6 flex justify-end'>
                  <button
                    onClick={closeModal}
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && citizenToDelete && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl max-w-md w-full'>
              <div className='p-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-xl font-bold text-red-800'>
                    Confirm Delete
                  </h2>
                  <button
                    onClick={closeDeleteModal}
                    className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
                  >
                    ×
                  </button>
                </div>
                <p className='text-gray-700 mb-6'>
                  Are you sure you want to delete the record for{' '}
                  <strong>{citizenToDelete.fullName}</strong>? This action
                  cannot be undone.
                </p>
                <div className='flex justify-end space-x-3'>
                  <button
                    onClick={closeDeleteModal}
                    className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Citizen Modal */}
        {showEditModal && citizenToEdit && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold text-blue-800'>
                    Edit Citizen Record
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        name='fullName'
                        value={editFormData.fullName || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Date of Birth
                      </label>
                      <input
                        type='date'
                        name='dob'
                        value={editFormData.dob || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Gender
                      </label>
                      <select
                        name='gender'
                        value={editFormData.gender || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      >
                        <option value=''>Select Gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Place of Birth
                      </label>
                      <input
                        type='text'
                        name='placeOfBirth'
                        value={editFormData.placeOfBirth || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Nationality
                      </label>
                      <input
                        type='text'
                        name='nationality'
                        value={editFormData.nationality || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Parent Serial Number
                      </label>
                      <input
                        type='text'
                        name='parentSerial'
                        value={editFormData.parentSerial || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Date of Issue
                      </label>
                      <input
                        type='date'
                        name='dateOfIssue'
                        value={editFormData.dateOfIssue || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Date of Expiry
                      </label>
                      <input
                        type='date'
                        name='dateOfExpiry'
                        value={editFormData.dateOfExpiry || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        County
                      </label>
                      <input
                        type='text'
                        name='county'
                        value={editFormData.county || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={editFormData.email || ''}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                  </div>
                  <div className='flex justify-end space-x-3 pt-4'>
                    <button
                      type='button'
                      onClick={closeEditModal}
                      className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllCitizenRecords
