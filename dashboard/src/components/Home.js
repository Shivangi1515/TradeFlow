import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import TopBar from './TopBar';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Check if token is passed in query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      
      // Decode JWT token payload to retrieve and cache username/email on port 3001
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
          if (decoded.username) localStorage.setItem('username', decoded.username);
          if (decoded.email) localStorage.setItem('email', decoded.email);
        }
      } catch (e) {
        console.error("Error decoding JWT payload on dashboard:", e);
      }
      
      // Clean token from the URL to keep it clean and secure
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Verify token presence
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      // Redirect to landing page login route
      window.location.href = "http://localhost:3000/login";
    } else {
      setAuthenticated(true);
      setLoading(false);
    }
  }, []);

  if (loading || !authenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#f8f9fa", fontFamily: "sans-serif" }}>
        <div className="text-center">
          <h3 className="text-muted fw-normal">Authenticating...</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;