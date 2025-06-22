import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import {
  FaIdCard, FaEnvelope, FaTransgender, FaGlobe,
  FaUser, FaCalendarAlt, FaCity, FaFileUpload
} from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sliderImages = [
  'https://www.conference.nira.gov.so/wp-content/uploads/2023/08/1449-RecoveredHADA-01.png',
  'https://www.conference.nira.gov.so/wp-content/uploads/2023/08/1449-RecoveredHADA-01.png',
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: false,
};

export default function AddID() {
  const printRef = useRef();

  const [formData, setFormData] = useState({
    idNumber: '', fullName: '', dob: '', gender: '',
    placeOfBirth: '', nationality: '', parentSerial: '',
    dateOfExpiry: '', dateOfIssue: '', county: '',
    email: '', photo: null, type: 'ID Card'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const today = new Date();
    const birthDate = new Date(formData.dob);
    const issueDate = new Date(formData.dateOfIssue);
    const expDate = new Date(formData.dateOfExpiry);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 15) {
      toast.error('❌ User must be older than 15 years');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('❌ Enter a valid email');
      return false;
    }

    const expYear = issueDate.getFullYear() + 10;
    if (expDate.getFullYear() !== expYear) {
      toast.error(`❌ Expiry date must be 10 years after issue date (${expYear})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post('http://localhost:5000/api/ids', formData);
      toast.success('✅ ID submitted successfully');
      setFormData({
        idNumber: '', fullName: '', dob: '', gender: '',
        placeOfBirth: '', nationality: '', parentSerial: '',
        dateOfExpiry: '', dateOfIssue: '', county: '',
        email: '', photo: null, type: 'ID Card'
      });
    } catch (err) {
      toast.error('❌ Submission failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadPDF = () => {
    html2pdf().set({
      margin: 0.3,
      filename: 'Jamhuuria_ID_Card.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).from(printRef.current).save();
  };

  const inputStyle = 'p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
  const iconStyle = 'text-blue-500 mr-2 text-sm';

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 font-sans">
      <ToastContainer />

      {/* SLIDER */}
      <div className="w-full lg:w-1/2 h-[250px] lg:h-screen lg:sticky top-0 overflow-hidden">
        <Slider {...sliderSettings}>
          {sliderImages.map((src, idx) => (
            <div key={idx} className="w-full h-full">
              <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>
      </div>

      {/* FORM + PREVIEW */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col-reverse lg:flex-col gap-8" ref={printRef}>

          {/* FORM */}
          <div className="w-full bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 uppercase">NIRA ID Card</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ 
                { label: 'ID Number', name: 'idNumber', type: 'text', icon: <FaIdCard className={iconStyle} /> },
                { label: 'Full Name', name: 'fullName', type: 'text', icon: <FaUser className={iconStyle} /> },
                { label: 'Date of Birth', name: 'dob', type: 'date', icon: <FaCalendarAlt className={iconStyle} /> },
                { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female'], icon: <FaTransgender className={iconStyle} /> },
                { label: 'Place of Birth', name: 'placeOfBirth', type: 'text', icon: <FaCity className={iconStyle} /> },
                { label: 'Email', name: 'email', type: 'email', icon: <FaEnvelope className={iconStyle} /> },
                { label: 'Nationality', name: 'nationality', type: 'text', icon: <FaGlobe className={iconStyle} /> },
                { label: 'Parent Serial Number', name: 'parentSerial', type: 'text', icon: <FaIdCard className={iconStyle} /> },
                { label: 'Date of Issue', name: 'dateOfIssue', type: 'date', icon: <FaCalendarAlt className={iconStyle} /> },
                { label: 'Date of Expiry', name: 'dateOfExpiry', type: 'date', icon: <FaCalendarAlt className={iconStyle} /> },
                { label: 'County', name: 'county', type: 'text', icon: <FaCity className={iconStyle} /> },
              ].map(({ label, name, type, icon, options }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    {icon} {label}
                  </label>
                  {type === 'select' ? (
                    <select name={name} value={formData[name]} onChange={handleChange} className={inputStyle} required>
                      <option value="">Select {label}</option>
                      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={`Enter ${label}`} className={inputStyle} required />
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaFileUpload className={iconStyle} /> Upload Photo
                </label>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full p-2 border-dashed border-2 border-blue-300 rounded-md cursor-pointer bg-white" required />
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:col-span-2 gap-4 pt-4">
                <button type="submit" className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition">
                  Submit ID
                </button>
                <button type="button" onClick={handleDownloadPDF} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition">
                  Download PDF
                </button>
              </div>
            </form>
          </div>

          {/* ID PREVIEW */}
          <div
            className="mx-auto bg-white border border-gray-300 rounded-lg shadow-lg flex justify-between items-start"
            style={{
              width: '8.6cm',
              height: '5.4cm',
              padding: '10px',
              fontSize: '9.5px',
              borderRadius: '12px'
            }}
          >
            <div className="flex-1 pr-2">
              <h2 className="text-center text-[11px] font-bold uppercase text-gray-800 mb-1">
                Republic of Somalia
              </h2>
              <h3 className="text-center text-[10px] font-semibold text-blue-700 mb-2">
                National Identity Card
              </h3>
              <div className="grid grid-cols-2 gap-x-2 gap-y-[2px] text-gray-800">
                <p><strong>ID:</strong> {formData.idNumber || '-'}</p>
                <p><strong>Name:</strong> {formData.fullName || '-'}</p>
                <p><strong>DOB:</strong> {formData.dob || '-'}</p>
                <p><strong>Gender:</strong> {formData.gender || '-'}</p>
                <p><strong>POB:</strong> {formData.placeOfBirth || '-'}</p>
                <p><strong>Nation:</strong> {formData.nationality || '-'}</p>
                <p><strong>Parent:</strong> {formData.parentSerial || '-'}</p>
                <p><strong>Issue:</strong> {formData.dateOfIssue || '-'}</p>
                <p><strong>Expiry:</strong> {formData.dateOfExpiry || '-'}</p>
                <p><strong>County:</strong> {formData.county || '-'}</p>
              </div>
              <p className="text-center text-[9px] text-gray-500 mt-1 italic">
                NIRA - National Identification and Registration Authority
              </p>
            </div>
            <div className="w-[75px] h-full flex items-center justify-center">
              {formData.photo ? (
                <img src={formData.photo} alt="Photo" className="w-[60px] h-[70px] object-cover border rounded-md" />
              ) : (
                <p className="text-[8px] italic text-gray-400 text-center">No photo</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
