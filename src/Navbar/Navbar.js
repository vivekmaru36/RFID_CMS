import React from "react";
import navbarItems from "./navbaritems";
import { Link,useLocation  } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';



const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function singupClick() {
    navigate('/registration');
  }
  function singInClick(){
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/" className="link">
        <div className="logo">LOGO</div>
        
      </Link>
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
            <button className="vvd sign-up" onClick={singupClick}><span>Sign up</span></button>
            <button className="vvd sign-in" onClick={singInClick}><span>Sign in</span></button>
        </div>

      </div>

     
     
    
    </nav>
  );
};

export default Navbar;