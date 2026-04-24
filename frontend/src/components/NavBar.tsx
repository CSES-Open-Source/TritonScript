import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../utils/userSlice";
import "./NavBar.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function NavBar() {
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/signout`, { credentials: "include" });
    } catch (_) {}
    dispatch(signOut());
    navigate("/");
  }

  const isHomePage = location.pathname === "/";

  return (
    <nav className={`navbar ${isHomePage ? "navbar-home" : ""} ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-logo">
        <Link to="/">
          <img src="src/assets/tritonscript.png" alt="TritonScript Logo" className="logo-image" />
        </Link>
      </div>

      <div className="navbar-center">
        <ul className="navbar-links">
          {currentUser && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/upload">My Notes</Link></li>
            </>
          )}
        </ul>
      </div>

      <div className="auth-button">
        {currentUser ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/signin")}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
