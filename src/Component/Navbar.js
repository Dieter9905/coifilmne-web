import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import logoImg from "../Images/logo.jpg";
import "../Css/Navbar.css";

function Navbar() {
  const [query, setQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Hàm kiểm tra user
  const checkUser = () => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    // Kiểm tra user đang login
    checkUser();
  }, []);

  useEffect(() => {
    // Listen for storage changes (logout từ tab khác)
    const handleStorageChange = () => {
      checkUser();
    };

    // Lắng nghe sự kiện custom "userLoggedIn" từ Login component
    const handleUserLogin = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLogin);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLogin);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    navigate(`/search?query=${query}`);
    setQuery("");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo">
        <NavLink to="/" className="logo-text">
          <img src={logoImg} alt="CoiFilmne Logo" className="logo-img" />
          <span className="logo-name">CoiFilmne</span>
        </NavLink>
      </div>

      {/* Menu */}
      <nav className="menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <a href="/#popular" className="nav-link" onClick={(e) => {
          e.preventDefault();
          document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Popular
        </a>
        <a href="/#action" className="nav-link" onClick={(e) => {
          e.preventDefault();
          document.getElementById('action')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Action
        </a>
        <a href="/#comedy" className="nav-link" onClick={(e) => {
          e.preventDefault();
          document.getElementById('comedy')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Comedy
        </a>
      </nav>

      {/* Search */}
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
      </form>

      {/* Auth */}
      <div className="auth">
        {currentUser ? (
          <UserProfile currentUser={currentUser} />
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
