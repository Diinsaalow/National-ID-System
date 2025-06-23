import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'

function UserProfile() {
  const { user, updateProfile, changePassword } = useAuth()

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateProfileForm = () => {
    if (!profileData.fullName.trim()) {
      setMessage('❌ Full name is required')
      setIsSuccess(false)
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      setMessage('❌ Please enter a valid email address')
      setIsSuccess(false)
      return false
    }

    return true
  }

  const validatePasswordForm = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage('❌ All password fields are required')
      setIsSuccess(false)
      return false
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('❌ New password must be at least 6 characters long')
      setIsSuccess(false)
      return false
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('❌ New passwords do not match')
      setIsSuccess(false)
      return false
    }

    return true
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const result = await updateProfile(profileData)

      if (result.success) {
        setIsSuccess(true)
        setMessage('✅ ' + result.message)
      } else {
        setIsSuccess(false)
        setMessage('❌ ' + result.message)
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('❌ Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )

      if (result.success) {
        setIsSuccess(true)
        setMessage('✅ ' + result.message)
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        setIsSuccess(false)
        setMessage('❌ ' + result.message)
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('❌ Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>
          Profile Settings
        </h1>

        {/* Message alert */}
        {message && (
          <div
            className={`mb-6 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
              isSuccess ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <div className='flex items-center gap-2'>
              {isSuccess ? (
                <FaCheckCircle className='text-xl' />
              ) : (
                <FaTimesCircle className='text-xl' />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Profile Information */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
              <FaUser /> Profile Information
            </h2>

            <form onSubmit={handleProfileSubmit} className='space-y-4'>
              <div className='relative'>
                <FaUser className='absolute top-3 left-3 text-gray-400' />
                <input
                  type='text'
                  name='fullName'
                  placeholder='Full Name'
                  className='w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className='relative'>
                <FaEnvelope className='absolute top-3 left-3 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  placeholder='Email Address'
                  className='w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className='text-sm text-gray-600'>
                <p>
                  <strong>Role:</strong> {user?.role}
                </p>
                <p>
                  <strong>Username:</strong> {user?.username}
                </p>
                <p>
                  <strong>Member since:</strong>{' '}
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type='submit'
                className={`w-full py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={isLoading}
              >
                <FaSave />
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
              <FaKey /> Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className='space-y-4'>
              <div className='relative'>
                <FaLock className='absolute top-3 left-3 text-gray-400' />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name='currentPassword'
                  placeholder='Current Password'
                  className='w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                />
                <span
                  className='absolute top-3 right-3 text-gray-500 cursor-pointer'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  title={
                    showCurrentPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className='relative'>
                <FaLock className='absolute top-3 left-3 text-gray-400' />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name='newPassword'
                  placeholder='New Password'
                  className='w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                />
                <span
                  className='absolute top-3 right-3 text-gray-500 cursor-pointer'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className='relative'>
                <FaLock className='absolute top-3 left-3 text-gray-400' />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  placeholder='Confirm New Password'
                  className='w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                />
                <span
                  className='absolute top-3 right-3 text-gray-500 cursor-pointer'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type='submit'
                className={`w-full py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={isLoading}
              >
                <FaKey />
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
