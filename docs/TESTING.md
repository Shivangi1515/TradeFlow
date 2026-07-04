# Unit Testing Guides & Mock Configurations

TradeFlow uses **Jest** (via Create React App's `react-scripts`) and **React Testing Library** to execute unit tests and component rendering verifications.

---

## Test Suites Location

Test files are placed in dedicated `__tests__` folders under each application's `src` folder:
- **Frontend Landing page:** `frontend/src/__tests__/`
- **Dashboard Trading page:** `dashboard/src/__tests__/`

---

## Technical Setup Challenges & Resolutions

### 1. Jest 27 & React Router 7 Conditional Exports
**Challenge:** React Router 7 (`react-router-dom` v7) uses modern conditional exports in `package.json` that Jest 27 (bundled in `react-scripts` 5.0.1) cannot resolve by default, leading to `Cannot find module 'react-router-dom'` errors.
**Resolution:** Added `jest.moduleNameMapper` inside the `package.json` of both the `frontend` and `dashboard` directories to map imports directly to the compiled build file:
```json
"jest": {
  "moduleNameMapper": {
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js"
  }
}
```
In individual unit tests, we mock `react-router-dom` directly using:
```javascript
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));
```
This bypasses routing dependencies entirely, enabling clean, lightweight assertions on anchor tags.

### 2. Testing DOM Assertions (`@testing-library/jest-dom`)
**Challenge:** Matchers like `toBeInTheDocument` are not registered by default on the Jest expect object, throwing type errors.
**Resolution:** Created a global test setup file `src/setupTests.js` in both projects containing:
```javascript
import '@testing-library/jest-dom';
```
Jest runs this configuration file automatically before executing any test suites, enabling matching assertions globally.

### 3. Testing Asynchronous Timer Workflows
**Challenge:** The ecosystem connection flow uses multiple nested `setTimeout` statements totaling 2.5 seconds. Testing this asynchronously is slow and flaky.
**Resolution:** Used Jest fake timers (`jest.useFakeTimers()`) to fast-forward execution time instantly. We wrap timer advancement inside React Test Utils `act()` blocks to ensure scheduled UI state changes render synchronously:
```javascript
test('simulates authorization flow and marks app as Connected', () => {
  render(<Apps />);
  // Connect and Authorize clicks...
  
  // Fast-forward first connection timeout (1500ms)
  act(() => {
    jest.advanceTimersByTime(1500);
  });
  // Fast-forward success popup timeout (1000ms)
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText(/Connected/)).toBeInTheDocument();
});
```

---

## Running the Tests

Ensure you have run `npm install` inside the target directory first.

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
*   **Run in Watch Mode:**
    Simply omit the `--watchAll=false` flag to keep Jest active, auto-recompiling tests on edits.
