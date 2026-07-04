# Ecosystem Partner Apps & Single Sign-On (SSO) Simulation

The **Apps** tab serves as a central hub where users can connect third-party thematic investing, option analytics, algorithmic trading, and stock research platforms to their TradeFlow brokerage account.

---

## Supported Ecosystem Applications

1.  💼 **Smallcase (Investing):** Diversified model portfolios.
2.  📈 **Sensibull (Derivatives/Options):** Advanced options strategy builder.
3.  ⚡ **Streak (Algorithmic):** No-code algorithmic strategy design and backtesting.
4.  🏢 **GoldenPi (Investing):** Fixed income corporate bonds and debentures.
5.  📊 **Tijori Finance (Research & Analysis):** Fundamental analytics, supply chain exposure, and market metrics.

---

## Application Categories Filtering

Partner apps are categorized using CSS badges:
- `investing` (Green)
- `options` (Blue)
- `algorithmic` (Purple)
- `analysis` (Orange)

The UI features a filter bar. Clicking a category filters the partner list instantly using local React state:
```javascript
const filteredApps = PARTNER_APPS.filter(
  (app) => activeCategory === "all" || app.category === activeCategory
);
```

---

## Simulated SSO Authentication Flow

Connecting a partner app simulates a standard OAuth2 / OpenID authorization workflow:

```
[Connect App] -> Open SSO Modal -> Click [Authorize Access] -> Loading spinner -> Connected State
```

1.  **Authorization Modal:** Displays the app logo side-by-side with TradeFlow's logo, outlining the list of requested scopes (permissions) for that specific app (e.g. read positions, execute trades).
2.  **Mock Latency:** Clicking "Authorize" runs a loading spinner for 1.5 seconds to simulate API requests and authentication checks.
3.  **Success State:** Toggles to a success message and checks off the app in green.
4.  **Disconnect:** Connected cards feature a Disconnect option that prompts for confirmation before revoking access.

---

## LocalStorage Integration & Persistence

Since the connections are clientside integrations, the active connection IDs are cached in the browser's local storage:
- Keys are saved in `localStorage.setItem("tradeflow_connected_apps", JSON.stringify(appIds))` on the dashboard origin (`localhost:3001`).
- On page mount, the component reads the connections, ensuring that even if the page is refreshed or the browser is closed, the partner integrations remain active.
