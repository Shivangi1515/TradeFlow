import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#FFF', transition: 'background-color 0.3s' }}>
            <div className="container p-2">
                <Link className="navbar-brand" to="/">
                    <img 
                        src='media/images/TradeFlow.png' 
                        alt="Logo" 
                        style={{ 
                            width: '35%', 
                            filter: theme === 'dark' ? 'brightness(0.9) contrast(1.1)' : 'none' 
                        }} 
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex ms-auto" role="search">
                        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/signup">SignUp</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/product">Product</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/pricing">Pricing</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/support">Support</Link>
                            </li>
                            <li className="nav-item">
                                <button 
                                    type="button"
                                    onClick={toggleTheme} 
                                    className="nav-link btn" 
                                    style={{ 
                                        border: "none", 
                                        background: "transparent", 
                                        color: theme === 'dark' ? '#ffc107' : '#555',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        padding: '0px 10px',
                                        marginLeft: '30px',
                                        outline: 'none',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                >
                                    {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun" style={{ color: "#ffc107" }}></i>}
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;