# Authentication System Documentation

This document describes the JWT-based authentication system implemented for the National ID System backend.

## Features

- **JWT Token-based Authentication**: Secure token-based authentication with configurable expiration
- **Password Hashing**: Bcrypt password hashing with salt rounds for security
- **User Registration & Login**: Complete user management with validation
- **Protected Routes**: Middleware for protecting routes that require authentication
- **Input Validation**: Comprehensive validation for all user inputs
- **Profile Management**: User profile updates and password changes

## Architecture

### Directory Structure

```
Backend/
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── controllers/
│   └── authController.js # Authentication logic
├── models/
│   └── User.js          # User model with password field
├── utils/
│   ├── jwt.js           # JWT utility functions
│   └── password.js      # Password hashing utilities
├── routes/
│   └── auth.js          # Authentication routes
└── scripts/
    └── migrateUsers.js  # User data migration script
```

## User Model

The User model includes the following fields:

- `username` (string, required, unique, 3-30 characters)
- `email` (string, required, unique, validated format)
- `password` (string, required, hashed with bcrypt, min 6 characters)
- `fullName` (string, required)
- `role` (enum: Admin, Reviewer, Birth Recorder, ID Card Recorder, Death Recorder)
- `timestamps` (createdAt, updatedAt)

## API Endpoints

### Public Routes (No Authentication Required)

#### POST /api/auth/register

Register a new user.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "Reviewer"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "Reviewer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "Reviewer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### Protected Routes (Authentication Required)

Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

#### GET /api/auth/me

Get current authenticated user information.

**Response:**

```json
{
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "Reviewer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/auth/profile

Update user profile (fullName and email).

**Request Body:**

```json
{
  "fullName": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "johnsmith@example.com",
    "fullName": "John Smith",
    "role": "Reviewer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/auth/change-password

Change user password.

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

## Security Features

### Password Security

- Passwords are hashed using bcrypt with 12 salt rounds
- Minimum password length of 6 characters
- Secure password comparison during login

### JWT Security

- Tokens expire after 24 hours
- Configurable JWT secret (use environment variable JWT_SECRET)
- Token verification on protected routes

### Input Validation

- Email format validation
- Username length and uniqueness validation
- Required field validation
- Password strength requirements

## Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGO_URI=your-mongodb-connection-string
```

## Migration

To migrate existing user data to the new system:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the migration script:
   ```bash
   npm run migrate
   ```

This will create the admin user with the new format while preserving existing functionality.

## Error Handling

The system provides comprehensive error handling:

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Invalid or missing authentication token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server-side errors

## Usage Examples

### Frontend Integration

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (response.ok) {
    localStorage.setItem('token', data.token)
    return data.user
  } else {
    throw new Error(data.message)
  }
}

// Protected API call
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/protected-route', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}
```

## Best Practices

1. **Store tokens securely**: Use httpOnly cookies or secure localStorage
2. **Handle token expiration**: Implement automatic logout on 401 responses
3. **Validate inputs**: Always validate user inputs on both frontend and backend
4. **Use HTTPS**: Always use HTTPS in production
5. **Regular token rotation**: Consider implementing token refresh mechanisms
6. **Monitor failed attempts**: Implement rate limiting for login attempts

## Testing

Test the authentication system using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
