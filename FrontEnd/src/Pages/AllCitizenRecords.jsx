import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const AllCitizenRecords = () => {
  const [citizens, setCitizens] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [idRes, birthRes] = await Promise.all([
          axios.get('/api/verified-ids'),
          axios.get('/api/verified-births'),
        ])
        setCitizens([...idRes.data, ...birthRes.data])
      } catch (err) {
        console.error(' Error fetching data:', err)
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
    'Photo',
    'Date of Issue',
    'County',
    'Email',
    'Type',
    'Actions',
  ]

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
        </div>

        <input
          type='text'
          placeholder='Search citizens...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

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
                  <td className='px-4 py-2'>
                    <img
                      src={citizen.photo}
                      alt='Citizen'
                      className='w-10 h-10 object-cover rounded-full border border-gray-300'
                    />
                  </td>
                  <td className='px-4 py-2'>{citizen.dateOfIssue}</td>
                  <td className='px-4 py-2'>{citizen.county}</td>
                  <td className='px-4 py-2'>{citizen.email}</td>
                  <td className='px-4 py-2'>{citizen.type || 'Birth'}</td>
                  <td className='px-4 py-2'>
                    <Link
                      to={`/view/${citizen._id}`}
                      className='text-blue-600 hover:underline'
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  )
}

export default AllCitizenRecords
