import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }, []);

    return (
        <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: '#FFF', transition: 'background-color 0.3s' }}>
            <div className="container p-2">
                <Link className="navbar-brand" to="/">
                    <img 
                        src='media/images/TradeFlow.png' 
                        alt="Logo" 
                        style={{ 
                            width: '35%', 
                            filter: 'none' 
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
                        </ul>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;