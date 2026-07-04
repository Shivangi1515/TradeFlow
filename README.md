# <p align="center"><img src="frontend/public/media/images/TradeFlow.png" alt="TradeFlow Logo" width="220" /><br>TradeFlow — Full-Stack Brokerage Portal</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase-Auth-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Jest-Tests-red?style=for-the-badge&logo=jest" alt="Jest" />
</p>

---

## 📖 What is TradeFlow?

TradeFlow is a stock trading and portfolio management application. The project is divided into three separate components:
1.  **Frontend Landing Page (Port 3000):** The public-facing marketing site with login and signup pages.
2.  **Trading Dashboard (Port 3001):** The private user application where clients manage holdings, track positions, view orders, and connect integrations.
3.  **Backend API Server (Port 3002):** The central Node/Express REST API that securely writes to MongoDB, signs session JWTs, and verifies Firebase Google Auth tokens.

---

## 🚀 Key Features

*   🔐 **Google Sign-In & Signup:** Instant, one-click authorization using **Firebase Auth** popup integration.
*   🔒 **Secure Credentials:** Standard password login salted and hashed securely using **bcryptjs**.
*   ⚙️ **Live Preferences Settings:** Customize display currency, default chart styles, email notifications, and UI themes (Light/Dark mode) saved in **MongoDB**.
*   🎨 **Interactive Dark Theme:** Functional dark mode styling that affects sidebars, grids, forms, and dialog sheets globally on toggling.
*   💼 **Ecosystem Partner Showcase:** Interactive directory of third-party platforms (like Smallcase, Sensibull, Streak) with custom category filters and OAuth-simulated SSO authorization modals.
*   🧪 **Unit Testing:** Full-fledged test suites using **Jest** and **React Testing Library** to verify login flows, settings panels, app connections, and route protectors.

---

## 🛠️ Tech Stack & Dependencies

*   **Frontend (Landing Page):** React 19, React Router v7, Firebase SDK, Bootstrap 5.
*   **Frontend (Dashboard):** React 19, Axios, Chart.js, Material-UI Icons, Vanilla CSS variables.
*   **Backend API Server:** Node.js, Express, Mongoose ODM, jsonwebtoken (JWT), bcryptjs.
*   **Testing Framework:** Jest, React Testing Library, Jest DOM Assertions.

---

## 💻 Local Development Setup

> [!IMPORTANT]
> Make sure you have **Node.js (v16+)** installed and a **MongoDB** connection string ready before running the steps below.

### Step 1: Run the Backend Server
1. Go to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` directory and add your keys:
   ```env
   MONGO_URL=your_mongodb_connection_string
   FIREBASE_API_KEY=your_firebase_api_key
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Step 2: Run the Landing Page Website
1. Go to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory and add your credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. Start the landing page:
   ```bash
   npm start
   ```

### Step 3: Run the Trading Dashboard Portal
1. Go to the `dashboard/` directory:
   ```bash
   cd ../dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dashboard portal:
   ```bash
   npm start
   ```

---

## 🧪 Running Unit Tests

Automated testing is configured using **Jest** and **React Testing Library**.

*   **Run Landing Page Tests:**
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

## 📖 Deep-Dive Guides

For an in-depth review of specific project sections, check out these guides inside the `docs/` folder:

| Guide Document | Focus Area |
| :--- | :--- |
| 🏗️ **[System Architecture Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/ARCHITECTURE.md)** | Mappings of component nodes, system flowcharts, and sequence diagrams. |
| 🔐 **[Authentication Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/AUTHENTICATION.md)** | Token verification, session JWT signing, and cross-port parameter redirection. |
| ⚙️ **[Settings & Theme Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/SETTINGS_AND_THEME.md)** | MongoDB sync preferences & native CSS Dark Mode variables. |
| 💼 **[Ecosystem Apps Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/ECOSYSTEM_APPS.md)** | Category filter tabs, simulated SSO authorizer modal, and persistent connection storage. |
| 🧪 **[Testing Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/TESTING.md)** | Jest resolution configurations, mock files, and mock timer setups. |
| 🗄️ **[Database Design Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/DATABASE.md)** | Collections, schemas, and seeding. |
| 📡 **[API Documentation Guide](file:///c:/Users/shiva/Desktop/TradeFlow/docs/API_DOCUMENTATION.md)** | Request/response payloads and REST endpoints. |
