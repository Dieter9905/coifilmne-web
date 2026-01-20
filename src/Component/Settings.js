import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { updatePassword, updateProfile } from "firebase/auth";
import "../Css/Settings.css";

function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setCurrentUser(userData);
    setDisplayName(userData.displayName || "");
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName
        });

        // Cập nhật localStorage
        const updatedUser = { ...currentUser, displayName };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setMessage("Cập nhật tên thành công!");
      }
    } catch (err) {
      setMessage("Cập nhật thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage("Cập nhật mật khẩu thành công!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setMessage("Vui lòng đăng nhập lại để đổi mật khẩu");
      } else {
        setMessage("Cập nhật mật khẩu thất bại: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1>⚙️ Settings</h1>

        {message && <div className={`message ${message.includes("thành công") ? "success" : "error"}`}>
          {message}
        </div>}

        {/* Update Profile Section */}
        <div className="settings-section">
          <h2>Thông tin tài khoản</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={currentUser.email} 
                disabled 
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>Tên hiển thị</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập tên của bạn"
              />
            </div>

            <button type="submit" disabled={loading} className="settings-btn">
              {loading ? "Đang xử lý..." : "Lưu thông tin"}
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="settings-section">
          <h2>Đổi mật khẩu</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            <button type="submit" disabled={loading} className="settings-btn">
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="settings-section">
          <h2>Thông tin tài khoản</h2>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{currentUser.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tên hiển thị:</span>
            <span className="info-value">{currentUser.displayName || "Chưa cập nhật"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
