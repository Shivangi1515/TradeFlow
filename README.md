# <p align="center"><img src="frontend/public/media/images/TradeFlow.png" alt="TradeFlow Logo" width="220" /><br>TradeFlow — Simulated Stock Trading & Brokerage Platform</p>

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

**TradeFlow** is a full-stack **stock trading and portfolio simulation platform** designed to replicate the user experience of modern, premium discount brokerages (such as Zerodha Kite or Upstox). 

It is designed for paper-trading simulation, full-stack architectural study, and demonstration. It allows users to simulate the lifecycle of stock market trading—ranging from searching and monitoring stock prices in a watchlist, executing buy/sell orders, tracking capital allocations, and analyzing real-time portfolio holdings and active positions.

---

## 💻 Core Application Nodes

The ecosystem is divided into three decoupled origin services working in harmony:

1.  **Frontend Marketing Page (Port 3000):** A public-facing web presence with static sections (About, Products, Pricing, Support) and secure authentication forms (Signup, Login, and "Continue with Google").
2.  **Trading Dashboard Portal (Port 3001):** The core client application. Once logged in, users can search assets, view live price updates, execute mock trades, manage holdings/positions, customize dashboard settings, and link ecosystem partner integrations.
3.  **Backend REST API Server (Port 3002):** The coordinator service that runs JWT middleware, validates Firebase Google login tokens, updates preferences inside MongoDB, handles order routing, and seeds default trading data for new users.

---

## ✨ Features & Functionality

*   📊 **Interactive Trading Terminal:** Search and monitor stocks in a real-time responsive watchlist. Hover over items to trigger instant Buy/Sell dialog windows.
*   💼 **Holdings & Positions Management:** Automatically tracks long-term investments (Holdings) and active intraday/delivery trades (Positions) with real-time profit and loss (P&L) calculations.
*   🛍️ **Order Executions:** Placing a mock trade creates an order entry, updates your capital funds balance, modifies your holdings/positions, and appends logs inside the Orders history page.
*   🔐 **Firebase Google Sign-In:** One-click OAuth login utilizing Firebase client popups verified securely against Google public keys on the backend.
*   ⚙️ **MongoDB User Preferences:** Live settings synchronization (UI Theme, Display Currency, default chart types, email notifications) stored inside the MongoDB user document.
*   🎨 **Premium Dark Theme:** Fully functional Dark Mode that toggles CSS variables globally across the dashboard sidebar, watchlist, cards, forms, and overlays.
*   🌐 **SSO Apps Ecosystem:** Simulated OAuth2 Single Sign-On (SSO) modal connections for broker integrations (like Smallcase, Sensibull, Streak, GoldenPi, and Tijori).

---

## 🛠️ Tech Stack Details

*   **Frontend (Landing site):** React 19, React Router v7, Firebase Auth Client SDK, Bootstrap 5.
*   **Frontend (Trading Panel):** React 19, Axios (with request/response interceptors), Chart.js, Material-UI Icons, CSS Variables.
*   **Backend REST API:** Node.js, Express, Mongoose ODM (MongoDB Atlas connection), jsonwebtoken (JWT), bcryptjs.
*   **Testing Suites:** Jest, React Testing Library, `@testing-library/jest-dom` extensions.

---

## 🛠️ Local Development Quickstart

> [!IMPORTANT]
> Ensure you have **Node.js (v16+)** installed and a **MongoDB** connection string ready before running the steps below.

### Step 1: Backend Server Setup
1. Go to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` folder:
   ```env
   MONGO_URL=your_mongodb_connection_string
   FIREBASE_API_KEY=your_firebase_api_key
   ```
3. Start the API server:
   ```bash
   npm start
   ```

### Step 2: Landing Page Setup
1. Go to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. Start the landing page server:
   ```bash
   npm start
   ```

### Step 3: Trading Dashboard Setup
1. Go to the `dashboard/` directory:
   ```bash
   cd ../dashboard
   ```
2. Install dependencies and start the portal:
   ```bash
   npm install
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
