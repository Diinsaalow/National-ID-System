import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const AllCitizenRecords = () => {
  const [citizens, setCitizens] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const recordsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Use the new combined endpoint
        const response = await axios.get('/api/all')
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

  const headers = [
    'ID Number',
    'Full Name',
    'Date of Birth',
    'Gender',
    'Place of Birth',
    'Nationality',
    'Parent Serial',
    'Date of Expiry',
    'Date of Issue',
    'County',
    'Email',
    'Type',
    'Actions',
  ]

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
                    <td className='px-4 py-2'>{citizen.placeOfBirth}</td>
                    <td className='px-4 py-2'>{citizen.nationality}</td>
                    <td className='px-4 py-2'>
                      {citizen.parentSerial || citizen.parentSerialNumber}
                    </td>
                    <td className='px-4 py-2'>{citizen.dateOfExpiry}</td>
                    
                    <td className='px-4 py-2'>{citizen.dateOfIssue}</td>
                    <td className='px-4 py-2'>{citizen.county}</td>
                    <td className='px-4 py-2'>{citizen.email}</td>
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
                      <Link
                        to={`/view/${citizen._id}`}
                        className='text-blue-600 hover:underline font-medium'
                      >
                        View
                      </Link>
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
      </div>
    </div>
  )
}

export default AllCitizenRecords
