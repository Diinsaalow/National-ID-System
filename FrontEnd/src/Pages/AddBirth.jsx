// File: AddBirth.jsx
import React, { useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  FaBaby,
  FaUser,
  FaCalendar,
  FaTransgender,
  FaMapMarked,
  FaFlag,
  FaUserTie,
  FaCalendarAlt,
  FaGlobeAfrica,
  FaEnvelope,
  FaImage,
  FaDownload,
} from 'react-icons/fa'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function AddBirth() {
  const printRef = useRef()

  const [formData, setFormData] = useState({
    IDNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    nationality: '',
    parentSerialNumber: '',
    dateOfExpiry: '',
    dateOfIssue: '',
    county: '',
    email: '',
  })

  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      )
      if (photo) data.append('photo', photo)

      await axios.post('/api/births', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('✅ Birth record submitted!')
      window.dispatchEvent(new Event('birth-record-added'))

      setFormData({
        IDNumber: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        placeOfBirth: '',
        nationality: '',
        parentSerialNumber: '',
        dateOfExpiry: '',
        dateOfIssue: '',
        county: '',
        email: '',
      })
      setPhoto(null)
      setPhotoPreview(null)
    } catch (error) {
      console.error(error.response?.data || error.message)
      toast.error(
        error.response?.data?.message || '❌ Failed to submit. Try again!'
      )
    }
  }

  const handleDownloadPDF = () => {
    html2pdf()
      .set({
        margin: 0.3,
        filename: 'Somalia_Birth_ID.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(printRef.current)
      .save()
  }

  const sliderImages = [
    'https://www.conference.nira.gov.so/wp-content/uploads/2023/08/1449-RecoveredHADA-01.png',
    'https://www.conference.nira.gov.so/wp-content/uploads/2023/08/1449-RecoveredHADA-01.png',
  ]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1600,
    arrows: false,
  }
  const inputStyle =
    'p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
  const iconStyle = 'text-green-600 mr-2 text-sm'

  const fields = [
    { name: 'IDNumber', placeholder: 'Enter ID Number', icon: <FaUser /> },
    { name: 'fullName', placeholder: 'Enter Full Name', icon: <FaUser /> },
    { name: 'dateOfBirth', type: 'date', icon: <FaCalendar /> },
    {
      name: 'gender',
      type: 'select',
      options: ['Male', 'Female'],
      icon: <FaTransgender />,
    },
    {
      name: 'placeOfBirth',
      placeholder: 'e.g. Beledweyne',
      icon: <FaMapMarked />,
    },
    { name: 'nationality', placeholder: 'e.g. Somali', icon: <FaFlag /> },
    {
      name: 'parentSerialNumber',
      placeholder: 'Enter Parent Serial No.',
      icon: <FaUserTie />,
    },
    { name: 'dateOfIssue', type: 'date', icon: <FaCalendarAlt /> },
    { name: 'dateOfExpiry', type: 'date', icon: <FaCalendarAlt /> },
    { name: 'county', placeholder: 'e.g. Banadir', icon: <FaGlobeAfrica /> },
    { name: 'email', placeholder: 'Enter Email Address', icon: <FaEnvelope /> },
  ]

  return (
    <div className='flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 font-sans'>
      <ToastContainer />

      {/* LEFT: Image Slider */}
      <div className='w-full lg:w-1/2 h-[200px] sm:h-[250px] lg:h-screen lg:sticky top-0 overflow-hidden'>
        <Slider {...sliderSettings}>
          {sliderImages.map((src, idx) => (
            <div key={idx} className='w-full h-full'>
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* RIGHT: Form Section */}
      <div
        className='w-full lg:w-1/2 h-full overflow-y-auto bg-white p-4 sm:p-6 lg:p-8'
        ref={printRef}
      >
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-green-700 uppercase mb-6 flex items-center justify-center gap-2'>
            <FaBaby /> Birth Registration
          </h1>

          <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-4 sm:p-6'>
            <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4'>
              {fields.map(
                ({ name, type = 'text', placeholder, options, icon }) => (
                  <div key={name}>
                    <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                      {icon} {name.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {type === 'select' ? (
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                      >
                        <option value=''>Select {name}</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={inputStyle}
                        required
                      />
                    )}
                  </div>
                )
              )}

              {/* Upload Photo */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                  <FaImage className={iconStyle} /> Upload Photo
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handlePhotoChange}
                  className='w-full p-2 border-dashed border-2 border-green-400 rounded-md cursor-pointer bg-white'
                  required
                />
              </div>

              {/* Actions */}
              <div className='flex flex-col sm:flex-row justify-center gap-4 pt-4'>
                <button
                  type='submit'
                  className='w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition'
                >
                  Submit
                </button>
                <button
                  type='button'
                  onClick={handleDownloadPDF}
                  className='w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition flex items-center justify-center gap-2'
                >
                  <FaDownload /> Download PDF
                </button>
              </div>
            </form>
          </div>

          {/* ID Preview */}
          <div className='mt-8 bg-white border border-gray-300 rounded-md shadow p-4 sm:p-6 w-full mx-auto relative text-[11px] font-mono'>
            <div className='text-center font-bold text-blue-900 text-lg uppercase mb-2'>
              Republic of Somalia
            </div>
            <div className='text-center text-xs text-gray-700 uppercase mb-4'>
              National Identity Card
            </div>
            <div className='flex pt-4 gap-4 flex-col lg:flex-row'>
              <div className='flex-1 space-y-1 text-gray-800 text-sm'>
                {Object.entries(formData).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                    {value || '-'}
                  </p>
                ))}
              </div>
              <div className='w-[100px] h-[120px] border border-gray-400 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden'>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt='ID'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-gray-400 text-center text-xs italic'>
                    No Photo
                  </span>
                )}
              </div>
            </div>
            <div className='mt-4 text-center text-gray-600 text-xs italic'>
              NIRA - National Identification and Registration Authority
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
