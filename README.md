# Authentication API Documentation

This document describes the authentication endpoints available in the application. The authentication system is powered by [Better Auth](https://better-auth.com/) and `@thallesp/nestjs-better-auth`, which automatically mounts these endpoints.

> [!NOTE]
> All authentication endpoints are prefixed with `/api/auth`.
> These endpoints manage sessions automatically using HTTP-only cookies.

---

## 1. Sign Up (Email & Password)

Create a new user account using an email address and password.

- **URL:** `/api/auth/sign-up/email`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

### Success Response

- **Code:** `200 OK`
- **Body:**

```json
{
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "emailVerified": false,
    "name": "John Doe",
    "createdAt": "2026-08-08T00:00:00.000Z",
    "updatedAt": "2026-08-08T00:00:00.000Z"
  },
  "session": {
    "id": "cuid...",
    "userId": "cuid...",
    "expiresAt": "2026-08-15T00:00:00.000Z"
  }
}
```

---

## 2. Sign In (Email & Password)

Authenticate an existing user. Upon success, an HTTP-only session cookie is automatically set in the browser.

- **URL:** `/api/auth/sign-in/email`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Success Response

- **Code:** `200 OK`
- **Body:** Similar to the Sign Up response, returns the `user` and `session` objects.

---

## 3. Get Current Session

Retrieve the currently authenticated user's session data. This relies on the session cookie automatically sent by the browser or the Authorization header.

- **URL:** `/api/auth/get-session`
- **Method:** `GET`

### Success Response (Authenticated)

- **Code:** `200 OK`
- **Body:**

```json
{
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "emailVerified": false,
    "name": "John Doe",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "session": {
    "id": "cuid...",
    "userId": "cuid...",
    "expiresAt": "..."
  }
}
```

### Error Response (Unauthenticated)

- **Code:** `401 Unauthorized` or Returns `null` depending on client configuration.

---

## 4. Sign Out

Invalidate the current session and clear the authentication cookie.

- **URL:** `/api/auth/sign-out`
- **Method:** `POST`

### Success Response

- **Code:** `200 OK`
- **Body:**

```json
{
  "success": true
}
```

---

## 5. Forget Password

Initiate the password reset flow. This will trigger an email containing a reset link (requires email provider configuration in `auth.ts`).

- **URL:** `/api/auth/forget-password`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "redirectTo": "http://localhost:3000/reset-password"
}
```

---

## 6. Reset Password

Complete the password reset flow using the token received via email.

- **URL:** `/api/auth/reset-password`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "newPassword": "new_secure_password123",
  "token": "reset-token-received-from-email"
}
```

---

## Postman / cURL Examples

### cURL Sign In Example

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"securepassword123"}' \
  -v
```

_(Note the `-v` flag to observe the `Set-Cookie` header in the response, which contains the `better-auth.session_token`)_

---

## Application Authenticated Routes (Examples)

The following routes are available under `/api/v1/users` and demonstrate the different levels of protection using Better Auth decorators in NestJS. To access protected routes, ensure the `better-auth.session_token` cookie is sent with your request.

### 1. Get Profile (Protected)

Requires a valid session. If no session is present, it returns `401 Unauthorized`.

- **URL:** `/api/v1/users/me`
- **Method:** `GET`
- **Decorator:** `@Session()`

**Success Response:**

```json
{
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2. Public Route

Accessible to anyone, regardless of authentication status.

- **URL:** `/api/v1/users/public`
- **Method:** `GET`
- **Decorator:** `@AllowAnonymous()`

**Success Response:**

```json
{
  "message": "This is a public route"
}
```

### 3. Optional Auth Route

Accessible to anyone. If the user is authenticated, the session data is injected; otherwise, it resolves to `null`.

- **URL:** `/api/v1/users/optional`
- **Method:** `GET`
- **Decorator:** `@OptionalAuth()`

**Success Response (Authenticated):**

```json
{
  "message": "Optional auth route",
  "isAuthenticated": true,
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Success Response (Unauthenticated):**

```json
{
  "message": "Optional auth route",
  "isAuthenticated": false,
  "user": null
}
```
