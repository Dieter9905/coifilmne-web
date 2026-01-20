import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import "../Css/UserProfile.css";

function UserProfile({ currentUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate avatar từ tên hoặc email
    const name = currentUser?.displayName || currentUser?.email?.charAt(0).toUpperCase() || "U";
    setAvatar(name.charAt(0).toUpperCase());
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      setShowDropdown(false);
      
      // Phát event để Navbar cập nhật
      window.dispatchEvent(new Event("userLoggedIn"));
      
      // Thêm delay nhỏ để đảm bảo localStorage đã cập nhật
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="user-profile">
      {/* Avatar Button */}
      <button 
        className="avatar-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="avatar-circle">
          {avatar}
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="avatar-circle-large">{avatar}</div>
            <div className="user-info">
              <p className="user-name">{currentUser?.displayName || currentUser?.email}</p>
              <p className="user-email">{currentUser?.email}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <Link 
            to="/watch-history" 
            className="dropdown-item"
            onClick={() => setShowDropdown(false)}
          >
            📺 Watch History
          </Link>

          <Link 
            to="/settings" 
            className="dropdown-item"
            onClick={() => setShowDropdown(false)}
          >
            ⚙️ Settings
          </Link>

          <div className="dropdown-divider"></div>

          <button 
            className="dropdown-item logout-item"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
