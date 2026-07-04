# Contributing to TradeFlow

We welcome contributions of all kinds! This guide outlines how to set up your environment, follow code conventions, and submit your pull requests successfully.

---

## 🛠️ Development Setup & Workflow

1.  **Fork the Repository:** Create a personal copy of the repository on GitHub.
2.  **Clone Locally:** Clone your fork to your workstation.
    ```bash
    git clone https://github.com/your-username/TradeFlow.git
    cd TradeFlow
    ```
3.  **Branching Policy:** Always create a descriptive feature branch from `main`:
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
4.  **Local Setup:** Run installations and configuration scripts as detailed in the [README.md](file:///c:/Users/shiva/Desktop/TradeFlow/README.md).

---

## 🎨 Code Styling & Guidelines

### 1. JavaScript / React Guidelines
*   Write modular React components. Keep styling separate from business logic where possible.
*   Avoid adding inline styles unless necessary; use global stylesheet variables (`dashboard/src/index.css` or dedicated styles).
*   Follow clean asynchronous code flows (`async/await` rather than nested promise chains).

### 2. State & Token Persistence
*   **Do not persist credentials on Port 3000 (Landing Page)** to maintain separation of concerns.
*   Keep Dashboard origins secure. Always decode queries client-side and clean URL paths immediately using `replaceState`.

---

## 🧪 Testing Requirements

Any new feature or component must include a test suite.
*   Add test files inside `__tests__/` subdirectories under `src/` (e.g. `src/__tests__/MyComponent.test.js`).
*   Mock external APIs (`fetch`, `axios`) and Firebase operations.
*   Run tests to verify everything passes before submitting:
    ```bash
    cd frontend && npm test -- --watchAll=false
    cd ../dashboard && npm test -- --watchAll=false
    ```

---

## 🚀 Submitting Pull Requests

1.  **Commit Changes:** Keep commit messages concise and descriptive:
    ```bash
    git commit -m "feat: add watch list search filtering"
    ```
2.  **Push to Fork:** Push your branch to your GitHub repository:
    ```bash
    git push origin feature/your-awesome-feature
    ```
3.  **Create a PR:** Submit a Pull Request targeting TradeFlow's `main` branch. Provide a clear description of the feature or fix along with screenshot confirmations for UI additions.
