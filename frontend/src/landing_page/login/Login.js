import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { API_URL, DASHBOARD_URL } from '../../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        const isFirebaseConfigured = 
            process.env.REACT_APP_FIREBASE_API_KEY && 
            process.env.REACT_APP_FIREBASE_API_KEY !== "YOUR_FIREBASE_API_KEY";

        if (!isFirebaseConfigured) {
            console.warn("Firebase credentials not configured. Using Mock Google login for development.");
            try {
                const res = await fetch(`${API_URL}/auth/google`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ credential: "MOCK_DEVELOPER_GOOGLE_TOKEN" })
                });

                if (!res.ok) {
                    const errMsg = await res.text();
                    throw new Error(errMsg || "Mock Google Sign-In failed");
                }

                const data = await res.json();
                // Redirect to Dashboard passing token
                window.location.href = `${DASHBOARD_URL}/?token=${data.token}`;
            } catch (err) {
                setError(err.message || "Mock Google Login failed");
                setLoading(false);
            }
            return;
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            const res = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credential: idToken })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Google Sign-In failed");
            }

            const data = await res.json();
            // Redirect to Dashboard passing token
            window.location.href = `${DASHBOARD_URL}/?token=${data.token}`;
        } catch (err) {
            console.error("Google login error:", err);
            setError(err.message || "Failed to authenticate with Google");
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Login failed");
            }

            const data = await res.json();
            // Redirect to Dashboard passing token
            window.location.href = `${DASHBOARD_URL}/?token=${data.token}`;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", paddingTop: "50px", paddingBottom: "50px" }}>
            <div className="card p-5 shadow-lg border-0" style={{ width: "100%", maxWidth: "450px", borderRadius: "16px", backgroundColor: "#fff" }}>
                <div className="text-center mb-4">
                    <img src="media/images/TradeFlow.png" alt="TradeFlow Logo" style={{ width: "160px", marginBottom: "15px" }} />
                    <h3 className="fw-bold text-dark">Welcome Back</h3>
                    <p className="text-muted">Log in to manage your portfolio and trade</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 px-3 mb-3 border-0 text-center" style={{ fontSize: "14px", borderRadius: "8px" }}>
                        <i className="fa-solid fa-triangle-exclamation me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label className="form-label text-secondary fw-semibold small">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: "8px 0 0 8px" }}>
                                <i className="fa-solid fa-envelope text-muted"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control bg-light border-start-0 py-2"
                                placeholder="name@example.com"
                                style={{ borderRadius: "0 8px 8px 0", outline: "none", boxShadow: "none" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label text-secondary fw-semibold small">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: "8px 0 0 8px" }}>
                                <i className="fa-solid fa-lock text-muted"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control bg-light border-start-0 py-2"
                                placeholder="••••••••"
                                style={{ borderRadius: "0 8px 8px 0", outline: "none", boxShadow: "none" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                        style={{ borderRadius: "8px", transition: "all 0.2s" }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Logging in...</span>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                <div className="position-relative my-4 text-center">
                    <hr className="text-muted" />
                    <span className="position-absolute bg-white px-3 text-secondary small" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        OR
                    </span>
                </div>

                {/* Google Sign-In via Firebase Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-outline-dark w-100 py-2 fw-semibold mb-4 d-flex justify-content-center align-items-center"
                    style={{ borderRadius: "8px", border: "1px solid #e0e0e0", backgroundColor: "#fff", color: "#333" }}
                    disabled={loading}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="" style={{ width: "18px", height: "18px", marginRight: "10px" }} />
                    Continue with Google
                </button>

                <div className="text-center mt-2">
                    <p className="text-muted small mb-0">
                        Don't have an account? <Link to="/signup" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
