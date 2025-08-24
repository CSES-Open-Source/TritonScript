import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar() {
  // get login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route


  // update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // Add scroll listener
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup listener
    };
  }, []);

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

  const isHomePage = location.pathname === "/";

  return (
      <nav
            className={`navbar ${isHomePage ? "navbar-home" : ""} ${
              isScrolled ? "navbar-scrolled" : ""
            }`}
          >
      <div className="navbar-logo">
        <Link to="/">
          <img src="src/assets/tritonscript.png" alt="TritonScript Logo" className="logo-image" />
        </Link>
      </div>

      {/* Navbar Links */}
      <div className="navbar-center">
        <ul className="navbar-links">
          {!isLoggedIn ? (
            <>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/upload">My Notes</Link>
              </li>
            </>
          )}
        </ul>
      </div>

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
