## 🔐 Authentication API

This document outlines the complete workflow for the authentication system in the `backend-api`.

## 1. Overview

The authentication process is a two-step mechanism:
1.  A user requests an OTP for their phone number.
2.  The user submits the received OTP along with their phone number to get an authentication token (JWT).

This ensures that the user has control over the provided phone number. The system is designed with security in mind, incorporating rate limiting to prevent abuse and secure practices for OTP and token management.
## 2. API Endpoints & Detailed Flow

The authentication flow is handled by two primary endpoints defined in `src/routes/auth.routes.ts`.

---

### 2.1. Sending an OTP

**Endpoint**: `POST /api/auth/send-otp`

This endpoint initiates the login/verification process. A user provides their phone number, and the system sends an OTP to it.

**Request Body:**

```json
{
  "phoneNumber": "+911234567890"
}
```

**Workflow:**

1.  **Rate Limiting (`sendOtpRateLimiter`)**: The request first passes through a rate-limiting middleware. This prevents a single user (or IP address) from requesting too many OTPs in a short period, mitigating spam and potential cost overruns from the SMS provider.

2.  **Input Validation (`sendOtpValidator`)**: The request body is validated. The `phoneNumber` is checked to ensure it is present and in a valid format. If validation fails, a `400 Bad Request` response is sent with details about the validation errors.

3.  **Controller Logic (`sendOtpController`)**: If validation passes, the controller takes over:
    a. **Generate OTP**: A random, typically 6-digit, numeric OTP is generated.
    b. **Set Expiry**: An expiry time is set for the OTP (e.g., 5 or 10 minutes).
    c. **Store OTP**: The user's `phoneNumber`, the generated `otp`, and its `expiry` time are saved to the MongoDB database. If an OTP for that number already exists, it is updated (upsert operation). The OTP is typically stored securely in a hashed format.
    d. **Send SMS**: The generated OTP is sent to the user's `phoneNumber` via an integrated SMS service (like MSG91, configured via `MSG91_API_KEY` in the environment variables).
    e. **Send Response**: A successful response is sent back to the client.

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

---

### 2.2. Verifying an OTP

**Endpoint**: `POST /api/auth/verify-otp`

This endpoint is used to verify the OTP that the user received and, upon success, issue an authentication token.

**Request Body:**

```json
{
  "phoneNumber": "+911234567890",
  "otp": "123456"
}
```

**Workflow:**

1.  **Rate Limiting (`verifyOtpRateLimiter`)**: Similar to the send-otp route, this endpoint is rate-limited to prevent brute-force attacks where an attacker tries to guess the OTP.

2.  **Input Validation (`verifyOtpValidator`)**: The request body is validated to ensure both `phoneNumber` and `otp` are present and correctly formatted.

3.  **Controller Logic (`verifyOtpController`)**:
    a. **Find OTP Record**: The controller queries the database for an OTP record matching the provided `phoneNumber`.
    b. **Validate OTP**:
        - If no record is found, or if the provided `otp` does not match the stored (hashed) OTP, an error is returned.
        - The controller checks if the OTP has expired. If `Date.now()` is past the stored `expiry` time, an error is returned.
    c. **Generate JWT**: If the OTP is valid, a JSON Web Token (JWT) is generated. The token's payload typically contains user information (like the phone number or a user ID) and is signed with a secret key (`JWT_SECRET`). The token is configured to expire after a certain period (`JWT_EXPIRY`).
    d. **Clean Up**: The verified OTP record is usually deleted from the database to prevent it from being used again.
    e. **Send Response**: The JWT is sent back to the client.

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IiszMTYz..."
}
```


The client can then store this token and include it in the `Authorization` header (e.g., `Authorization: Bearer <token>`) for all subsequent requests to protected routes.

### User Authentication
1. **Register**: `POST /api/auth/register`
   - Request: 
     ```json
     { 
       "name": "User Name", 
       "email": "user@example.com", 
       "phone": "+919876543210", 
       "password": "securePassword", 
       "verificationToken": "jwt-token",
       "emergencyContacts": [
         { "name": "Contact Name", "phone": "+919876543211", "relation": "Family" }
       ]
     }
     ```
   - Response: 
     ```json
     { 
       "success": true, 
       "user": { "id": "userId", "name": "User Name", "email": "user@example.com" },
       "tokens": { "accessToken": "jwt-token", "refreshToken": "jwt-token", "expiresIn": 3600 }
     }
     ```

2. **Login**: `POST /api/auth/login`
   - Request: `{ "email": "user@example.com", "password": "securePassword" }`
   - Response: 
     ```json
     { 
       "success": true, 
       "user": { "id": "userId", "name": "User Name", "email": "user@example.com" },
       "tokens": { "accessToken": "jwt-token", "refreshToken": "jwt-token", "expiresIn": 3600 }
     }
     ```
