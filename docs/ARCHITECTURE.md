# TradeFlow System Architecture

This document describes the high-level architecture, module interaction, and data flows of the TradeFlow ecosystem.

---

## 🏛️ Ecosystem Architecture

TradeFlow is structured as a decoupled multi-tier architecture consisting of three primary nodes:

```mermaid
graph TD
    subgraph Client Applications
        A[Landing Page<br>Port 3000] -->|SSO URL Redirect| B[Trading Dashboard<br>Port 3001]
    end
    subgraph Services & Persistence
        B -->|REST API Requests| C[Backend Server<br>Port 3002]
        C -->|Mongoose Queries| D[(MongoDB Database)]
        A -->|Authentication token query| E[Firebase Auth Service]
    end
```

---

## 🧩 Component Node Responsibilities

### 1. Frontend Landing Page (Port 3000)
- **Role:** Customer-facing marketing platform and gateway to credentials management.
- **Tech Stack:** React 19, React Router v7, Vanilla CSS, Firebase Client SDK.
- **Primary Pages:** Home/Hero, About, Products, Pricing, Support, Login, Signup.
- **Security Scope:** Bypasses local state persistence. Submits login/signup actions, retrieves session credentials, and redirects immediately to the Dashboard origin.

### 2. Trading Dashboard (Port 3001)
- **Role:** Interactive brokerage portal displaying live trading data and profile controls.
- **Tech Stack:** React 19, Axios, Chart.js, MUI Icons, Vanilla CSS.
- **Primary Pages:** Summary Analytics, Orders log, Holdings table, Positions tracker, Profile settings panel, Ecosystem Apps grid.
- **Security Scope:** Receives tokens through URL queries on mount, stores tokens securely inside its own local storage, and injects Authorization headers in all outgoing requests via Axios interceptors.

### 3. Backend Server (Port 3002)
- **Role:** Data provider and authentication coordinator.
- **Tech Stack:** Node.js, Express, Mongoose (MongoDB driver), jsonwebtoken, bcryptjs.
- **Primary Modules:** Security middlewares (JWT verification, Firebase signature validation), Database models (Users, Settings, Holdings, Positions, Orders), automatic portfolio seeder.

---

## 🔁 Key Data Flows

### 1. User Authentication Flow
1. User requests Google Sign-In on Port 3000.
2. Firebase SDK handles OAuth popup and returns an ID Token.
3. Port 3000 posts the ID Token to Port 3002.
4. Backend verifies the signature against Firebase servers.
5. Backend signs a local JWT containing the user's ID, username, and email.
6. Backend responds with the JWT, and Port 3000 redirects to `http://localhost:3001/?token=JWT`.

### 2. Settings Synchronization & Theme Rendering
1. User updates theme to "Dark" inside Dashboard Settings on Port 3001.
2. Port 3001 sends a PUT request containing the modified preference payload to Port 3002.
3. Backend updates the user preference document inside MongoDB.
4. Port 3001 updates the active React states and appends the `.dark-theme` CSS class directly to `document.body` for responsive, global visual updates.
