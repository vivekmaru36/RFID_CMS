import React, { useState, useEffect } from "react";
import navbarItems from "./navbaritems";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsSignedIn(!!token); // Set isSignedIn to true if token exists, otherwise false
  }, []);

  function logOutClick() {
    // Clear the authentication token from cookies
    Cookies.remove('token');

    // Set isSignedIn to false after successful logout
    setIsSignedIn(false);

    // Redirect to the home page
    navigate('/');
  }

  function singupClick() {
    navigate('/registration');
  }

  function singInClick() {
    navigate("/login");
  }

  // Check if the current location is the home page
  const isHomePage = location.pathname === '/';

  return (
    <nav>
      <Link to="/" className="link">
        <div className="logo">LOGO</div>
      </Link>
      {isHomePage && (
        <div className="menu-items">
          {navbarItems.map((item, index) => (
            <Link
              className={`link ${location.pathname === item.link ? 'active' : ''}`}
              to={item.link}
              key={index}
            >
              {item.title}
            </Link>
          ))}
          <div className="navbar-text">
            {!isSignedIn && (
              <>
                <button className="vvd sign-up" onClick={singupClick}><span>Sign up</span></button>
                <button className="vvd sign-in" onClick={singInClick}><span>Sign in</span></button>
              </>
            )}
            {isSignedIn && (
              <button className="log-out" onClick={logOutClick}><span>Log out</span></button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
