import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if token exists and validate it on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')

      if (storedToken) {
        try {
          // Verify token by fetching current user
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setToken(storedToken)
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error('Token validation error:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)

        toast.success('Login successful')
        return { success: true, message: data.message }
      } else {
        toast.error(`${data.message}`)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.')
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.info('👋 Logged out successfully')
    navigate('/')
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)

        toast.success(' Registration successful')
        return { success: true, message: data.message }
      } else {
        toast.error(` ${data.message}`)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success(' Profile updated successfully')
        return { success: true, message: data.message }
      } else {
        toast.error(` ${data.message}`)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(' Password changed successfully')
        return { success: true, message: data.message }
      } else {
        toast.error(` ${data.message}`)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user
  }

  // Get auth headers for API requests
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    isAuthenticated,
    getAuthHeaders,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
