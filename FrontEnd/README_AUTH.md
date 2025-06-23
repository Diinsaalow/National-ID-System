# Frontend Authentication System Documentation

This document describes the comprehensive JWT-based authentication system implemented for the National ID System frontend.

## Features

- **JWT Token-based Authentication**: Secure token-based authentication with automatic token validation
- **Context-based State Management**: Centralized authentication state using React Context
- **Protected Routes**: Automatic route protection with loading states
- **Session Persistence**: Automatic token validation on app load
- **User Registration & Login**: Complete user management with validation
- **Profile Management**: User profile updates and password changes
- **Automatic Logout**: Token expiration handling and automatic logout
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Architecture

### Directory Structure

```
FrontEnd/src/
├── context/
│   └── AuthContext.jsx          # Authentication context provider
├── hooks/
│   └── useApi.js               # Custom hook for authenticated API requests
├── components/
│   └── ProtectedRoute.jsx      # Route protection component
├── Pages/
│   ├── LoginPage.jsx           # Login page
│   ├── RegisterPage.jsx        # Registration page
│   └── UserProfile.jsx         # Profile settings page
└── App.jsx                     # Main app with routing
```

## Components

### AuthContext

The `AuthContext` provides centralized authentication state and methods:

```jsx
const {
  user, // Current user object
  token, // JWT token
  loading, // Loading state
  login, // Login function
  logout, // Logout function
  register, // Registration function
  updateProfile, // Profile update function
  changePassword, // Password change function
  isAuthenticated, // Authentication check function
  getAuthHeaders, // Get auth headers for API requests
} = useAuth()
```

#### Key Features:

- **Automatic Token Validation**: Validates stored tokens on app load
- **Session Persistence**: Maintains user session across browser refreshes
- **Automatic Logout**: Handles token expiration and invalid tokens
- **Toast Notifications**: User-friendly success/error messages

### ProtectedRoute

Protects routes that require authentication:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path='/dashboard' element={<Dashboard />}>
    {/* Protected routes */}
  </Route>
</Route>
```

#### Features:

- **Loading States**: Shows spinner while checking authentication
- **Automatic Redirects**: Redirects to login if not authenticated
- **Seamless UX**: Smooth transitions and loading indicators

### useApi Hook

Provides authenticated API request methods:

```jsx
const { get, post, put, patch, delete: del, uploadFile } = useApi()

// Example usage
const result = await get('/api/users')
const result = await post('/api/births', birthData)
```

#### Features:

- **Automatic Token Inclusion**: Adds auth headers to all requests
- **Error Handling**: Handles 401 responses with automatic logout
- **File Uploads**: Specialized method for file uploads
- **Consistent Response Format**: Standardized success/error responses

## Pages

### LoginPage

Complete login form with validation and error handling:

- **Form Validation**: Email and password validation
- **Loading States**: Disabled form during submission
- **Error Messages**: Clear error feedback
- **Registration Link**: Easy navigation to registration
- **Responsive Design**: Mobile-friendly interface

### RegisterPage

User registration with comprehensive validation:

- **Field Validation**: Username, email, password validation
- **Password Confirmation**: Ensures password match
- **Role Selection**: Choose user role during registration
- **Form Security**: Password visibility toggles
- **Success Handling**: Automatic redirect after registration

### UserProfile

Profile management and password changes:

- **Profile Updates**: Update name and email
- **Password Changes**: Secure password change with current password verification
- **User Information Display**: Shows current user details
- **Form Validation**: Comprehensive input validation
- **Success Feedback**: Clear success/error messages

## API Integration

### Authentication Endpoints

The frontend integrates with these backend endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Request Headers

All authenticated requests automatically include:

```javascript
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Response Handling

All API responses are standardized:

```javascript
// Success response
{
  success: true,
  data: { /* response data */ },
  message: "Success message"
}

// Error response
{
  success: false,
  message: "Error message"
}
```

## Security Features

### Token Management

- **Secure Storage**: Tokens stored in localStorage
- **Automatic Validation**: Token validation on app load
- **Expiration Handling**: Automatic logout on token expiration
- **Invalid Token Cleanup**: Removes invalid tokens automatically

### Form Security

- **Input Validation**: Client-side validation for all forms
- **Password Visibility**: Toggle password visibility for better UX
- **Loading States**: Prevents multiple submissions
- **Error Handling**: Comprehensive error messages

### Route Protection

- **Authentication Checks**: All protected routes verify authentication
- **Loading States**: Smooth loading experience
- **Automatic Redirects**: Seamless navigation flow

## Usage Examples

### Using Authentication Context

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    const result = await login(email, password)
    if (result.success) {
      // Navigate to dashboard
    }
  }

  return (
    <div>
      {isAuthenticated() ? (
        <p>Welcome, {user.fullName}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Making Authenticated API Requests

```jsx
import { useApi } from '../hooks/useApi'

function MyComponent() {
  const { get, post } = useApi()

  const fetchData = async () => {
    const result = await get('/api/users')
    if (result.success) {
      setUsers(result.data)
    }
  }

  const createRecord = async (data) => {
    const result = await post('/api/births', data)
    if (result.success) {
      // Handle success
    }
  }
}
```

### Protected Route Setup

```jsx
// In App.jsx
<Route element={<ProtectedRoute />}>
  <Route path='/dashboard' element={<Dashboard />}>
    <Route index element={<Home />} />
    <Route path='profile' element={<UserProfile />} />
    {/* Other protected routes */}
  </Route>
</Route>
```

## Error Handling

### Network Errors

- **Offline Detection**: Checks for internet connectivity
- **Retry Logic**: Automatic retry for failed requests
- **User Feedback**: Clear error messages for network issues

### Authentication Errors

- **Invalid Credentials**: Clear feedback for login failures
- **Token Expiration**: Automatic logout and redirect
- **Server Errors**: Graceful handling of server issues

### Form Validation Errors

- **Real-time Validation**: Immediate feedback on form errors
- **Field-specific Messages**: Targeted error messages
- **Success Confirmation**: Clear success feedback

## Best Practices

1. **Always use the useAuth hook** for authentication state
2. **Use the useApi hook** for all API requests
3. **Wrap protected routes** with ProtectedRoute component
4. **Handle loading states** for better UX
5. **Provide clear error messages** to users
6. **Validate forms** before submission
7. **Use secure password practices** (visibility toggles, confirmation)

## Testing

The authentication system can be tested by:

1. **Registration**: Create a new user account
2. **Login**: Authenticate with valid credentials
3. **Protected Routes**: Access dashboard without authentication (should redirect)
4. **Profile Updates**: Modify user profile information
5. **Password Changes**: Change user password
6. **Logout**: Clear authentication state
7. **Token Expiration**: Test with expired tokens

## Security Considerations

- **HTTPS Only**: Always use HTTPS in production
- **Token Storage**: Consider httpOnly cookies for enhanced security
- **Input Sanitization**: Validate all user inputs
- **Rate Limiting**: Implement rate limiting on authentication endpoints
- **Password Policies**: Enforce strong password requirements
- **Session Management**: Implement proper session handling

## Troubleshooting

### Common Issues

1. **Token not persisting**: Check localStorage permissions
2. **API requests failing**: Verify backend is running and accessible
3. **Protected routes not working**: Ensure AuthProvider wraps the app
4. **Loading states not showing**: Check loading state implementation

### Debug Tips

- Check browser console for errors
- Verify token in localStorage
- Test API endpoints directly
- Check network tab for request/response details
