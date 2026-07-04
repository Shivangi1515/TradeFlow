# TradeFlow

TradeFlow is a stock trading and portfolio management application. It is divided into three parts:
*   **Landing Page (Port 3000):** The public website with signup and login pages.
*   **Trading Dashboard (Port 3001):** The user portal showing portfolio holdings, positions, and settings.
*   **Backend Server (Port 3002):** The API that connects to MongoDB and manages user accounts and settings.

---

## 🚀 Features

*   **Google Sign-In & Email Signup:** Sign in with Google (Firebase) or create an email account.
*   **Live Settings & Dark Mode:** Toggle between Light/Dark themes and change default settings synced with MongoDB.
*   **Partner Apps Showcase:** Connect third-party apps (Smallcase, Sensibull, Streak) directly to your trading account.
*   **Unit Tests:** Unit tests included to check all pages are working.

---

## 🛠️ How to Setup & Run

Follow these simple steps to run the application locally:

### Step 1: Run the Backend API
1. Open your terminal in the `backend/` folder:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` folder and paste your database link:
   ```env
   MONGO_URL=your_mongodb_connection_string
   FIREBASE_API_KEY=your_firebase_api_key
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Step 2: Run the Landing Page (Frontend)
1. Open a new terminal in the `frontend/` folder:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` folder and paste your Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
3. Start the website:
   ```bash
   npm start
   ```

### Step 3: Run the Trading Dashboard
1. Open a new terminal in the `dashboard/` folder:
   ```bash
   cd dashboard
   npm install
   ```
2. Start the dashboard:
   ```bash
   npm start
   ```

---

## 🧪 How to Run Tests

Verify everything is working by running the unit tests:

*   **Run Frontend Tests:**
    ```bash
    cd frontend
    npm test -- --watchAll=false
    ```
*   **Run Dashboard Tests:**
    ```bash
    cd dashboard
    npm test -- --watchAll=false
    ```

---

## 📖 Detailed Guides

If you want to read more about how each feature works, check out these guides inside the `docs/` folder:

*   🏗️ **[System Architecture Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/ARCHITECTURE.md)** - System nodes, port maps, and data flows.
*   🔐 **[Authentication Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/AUTHENTICATION.md)** - Google Sign-In and login details.
*   ⚙️ **[Settings & Theme Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/SETTINGS_AND_THEME.md)** - Storing settings in MongoDB and Dark Mode.
*   💼 **[Ecosystem Apps Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/ECOSYSTEM_APPS.md)** - How the partner apps connection works.
*   🧪 **[Testing Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/TESTING.md)** - Details about mock tests and timer tests.
*   🗄️ **[Database Design Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/DATABASE.md)** - Collections, schemas, and seeding.
*   📡 **[API Documentation Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/API_DOCUMENTATION.md)** - Request/response payloads and REST endpoints.
