import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export const useApi = () => {
  const { token, logout, getAuthHeaders } = useAuth()

  // Helper function to handle API responses
  const handleResponse = async (response) => {
    if (response.status === 401) {
      // Token expired or invalid
      logout()
      return { success: false, message: 'Session expired. Please login again.' }
    }

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.message || 'Request failed' }
    }

    return { success: true, data }
  }

  // GET request
  const get = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('GET request error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error' }
    }
  }

  // POST request
  const post = async (url, body = {}, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('POST request error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error' }
    }
  }

  // PUT request
  const put = async (url, body = {}, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('PUT request error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error' }
    }
  }

  // PATCH request
  const patch = async (url, body = {}, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('PATCH request error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error' }
    }
  }

  // DELETE request
  const del = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('DELETE request error:', error)
      toast.error(' Network error. Please try again.')
      return { success: false, message: 'Network error' }
    }
  }

  // File upload with FormData
  const uploadFile = async (url, formData, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        body: formData,
        ...options,
      })

      return await handleResponse(response)
    } catch (error) {
      console.error('File upload error:', error)
      toast.error(' Upload failed. Please try again.')
      return { success: false, message: 'Upload failed' }
    }
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,
  }
}
