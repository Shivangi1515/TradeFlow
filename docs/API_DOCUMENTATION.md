# Backend API Documentation

The backend API server operates on `http://localhost:3002`, providing REST endpoints for user authentication, settings, and portfolio data.

---

## Headers & Authentication Middleware

Routes under the Portfolio and Settings categories are protected and require a valid session JWT token:

*   **Request Header:**
    ```http
    Authorization: Bearer <JWT_TOKEN>
    ```
*   **Validation Middleware (`authenticateToken`):**
    Extracts the token from the header, verifies the signature against `JWT_SECRET`, and mounts the decoded payload (`userId`, `username`, `email`) onto `req.user`. Returning `401 Unauthorized` if invalid or missing.

---

## REST Endpoints Directory

### 🔐 1. Authentication Routes

#### `POST /auth/signup`
Creates a new user account and seeds initial portfolio data.
- **Request Body:**
  ```json
  {
    "username": "investor123",
    "email": "investor@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "JWT_STRING",
    "username": "investor123",
    "email": "investor@example.com"
  }
  ```

#### `POST /auth/login`
Validates credentials and issues a session token.
- **Request Body:**
  ```json
  {
    "email": "investor@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "JWT_STRING",
    "username": "investor123",
    "email": "investor@example.com"
  }
  ```

#### `POST /auth/google`
Authenticates a user via Firebase Google OAuth.
- **Request Body:**
  ```json
  {
    "credential": "FIREBASE_ID_TOKEN"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "JWT_STRING",
    "username": "Google User Name",
    "email": "googleuser@gmail.com"
  }
  ```

---

### ⚙️ 2. User Settings Routes (JWT Protected)

#### `GET /user/settings`
Fetches preferences stored in MongoDB.
- **Response (200 OK):**
  ```json
  {
    "theme": "light",
    "currency": "INR",
    "chartType": "candle",
    "notifications": true
  }
  ```

#### `PUT /user/settings`
Updates preferences.
- **Request Body:**
  ```json
  {
    "theme": "dark",
    "currency": "USD",
    "chartType": "line",
    "notifications": false
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "theme": "dark",
    "currency": "USD",
    "chartType": "line",
    "notifications": false
  }
  ```

---

### 📈 3. Portfolio & Trading Routes (JWT Protected)

#### `GET /allHoldings`
Retrieves all holdings owned by the user.
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "6a495771...",
      "name": "RELIANCE",
      "qty": 10,
      "avg": 2400.50,
      "price": 2450.00,
      "net": "+2.06%",
      "day": "+0.45%"
    }
  ]
  ```

#### `GET /allPositions`
Retrieves active positions.
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "6a495772...",
      "product": "CNC",
      "name": "TATASTEEL",
      "qty": 50,
      "avg": 120.40,
      "price": 118.20,
      "net": "-1.83%",
      "day": "-0.90%",
      "isLoss": true
    }
  ]
  ```

#### `GET /allOrders`
Retrieves transactional logs of completed orders.
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "6a495773...",
      "name": "WIPRO",
      "qty": 15,
      "price": 412.00,
      "mode": "BUY",
      "date": "2026-07-04T18:50:00.000Z"
    }
  ]
  ```

#### `POST /newOrder`
Places a new buy or sell order for a stock.
- **Request Body:**
  ```json
  {
    "name": "RELIANCE",
    "qty": 5,
    "price": 2450.00,
    "mode": "BUY"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Order placed successfully",
    "order": {
      "_id": "6a495774...",
      "user": "6a495771...",
      "name": "RELIANCE",
      "qty": 5,
      "price": 2450.00,
      "mode": "BUY",
      "date": "2026-07-04T18:55:00.000Z",
      "__v": 0
    }
  }
  ```
