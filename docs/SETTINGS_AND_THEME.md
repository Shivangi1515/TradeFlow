# Settings Synchronization & Dark Mode Layouts

TradeFlow provides a premium user profile configurations tab syncing UI styles and default settings directly with MongoDB.

---

## Settings Schema Design

Preferences are saved inside the main Mongoose user schema to ensure settings are synchronized across all sessions:

```javascript
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  // User Preferences
  theme: { type: String, default: "light" },       // "light" | "dark"
  currency: { type: String, default: "INR" },    // "INR" | "USD"
  chartType: { type: String, default: "candle" }, // "candle" | "line"
  notifications: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

---

## Preferences Sync API

*   **GET `/user/settings`:** Retrieves the currently authenticated user's settings profile. Protected by the JWT verification middleware (`authenticateToken`).
*   **PUT `/user/settings`:** Receives updated settings variables, saves them to the database, and returns the modified settings object.

---

## Client-Side Styling & Dark Mode

The settings view manages theme changes by adding or removing the `.dark-theme` CSS class directly to/from the document root (`document.body`).

### 1. Style Variable Tokens (`dashboard/src/index.css`)
We define custom colors in CSS variables that switch automatically when `.dark-theme` is appended to `body`:

```css
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --input-bg: #f9f9f9;
}

body.dark-theme {
  --background-color: #121212;
  --text-color: #e0e0e0;
  --card-bg: #1e1e1e;
  --border-color: #333333;
  --input-bg: #2d2d2d;
  background-color: var(--background-color);
  color: var(--text-color);
}
```

### 2. State & Mounting Sync
When the Settings view mounts or saves, it updates both the backend and toggles the DOM styles immediately:

```javascript
// Synchronizing theme variables to JSDOM body
useEffect(() => {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}, [theme]);
```
This is fully responsive, affecting all cards, grid overlays, navigation panels, sidebar links, settings forms, and buttons instantly.
