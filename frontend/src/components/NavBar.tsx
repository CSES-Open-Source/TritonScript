import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar() {
  // get login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const navigate = useNavigate();

  // update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } else {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo linking to Home */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="src/assets/tritonscript.png" alt="TritonScript Logo" className="logo-image" />
        </Link>
      </div>

      {/* Centered Navbar Links */}
      <ul className="navbar-links">
        {!isLoggedIn ? (
          <>
            {/* <li>
              <Link to="/faqs">FAQs</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li> */}
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/upload">Upload Notes</Link>
            </li>
          </>
        )}
      </ul>

      {/* Login/Logout Button */}
      <div className="auth-button">
        <button onClick={handleAuthClick}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
