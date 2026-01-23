import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { updatePassword, updateProfile } from "firebase/auth";
import { t, getLanguage, setLanguage } from "../i18n/translations";
import "../Css/Settings.css";

function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguageState] = useState(getLanguage());
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
        setMessage(t("settings.updateSuccess"));
      }
    } catch (err) {
      setMessage(t("settings.updateError") + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setMessage(t("settings.fillAllFields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t("settings.passwordMatch"));
      return;
    }

    if (newPassword.length < 6) {
      setMessage(t("settings.passwordMinLength"));
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage(t("settings.passwordSuccess"));
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setMessage(t("settings.recentLoginRequired"));
      } else {
        setMessage(t("settings.passwordError") + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguageState(newLang);
    setLanguage(newLang);
    window.location.reload(); // Reload to apply language changes
  };

  if (!currentUser) return null;

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1>{t("settings.title")}</h1>

        {message && <div className={`message ${message.includes(t("common.success")) || message.includes("success") || message.includes("thành công") ? "success" : "error"}`}>
          {message}
        </div>}

        {/* Language Selection Section */}
        <div className="settings-section">
          <h2>{t("settings.language")}</h2>
          <form>
            <div className="form-group">
              <label htmlFor="language">{t("settings.selectLanguage")}</label>
              <select 
                id="language"
                value={language} 
                onChange={handleLanguageChange}
                className="language-select"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>
            </div>
          </form>
        </div>

        {/* Update Profile Section */}
        <div className="settings-section">
          <h2>{t("settings.profileSettings")}</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>{t("auth.email")}</label>
              <input 
                type="email" 
                value={currentUser.email} 
                disabled 
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>{t("settings.displayName")}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("settings.displayName")}
              />
            </div>

            <button type="submit" disabled={loading} className="settings-btn">
              {loading ? t("common.loading") : t("settings.updateBtn")}
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="settings-section">
          <h2>{t("settings.changePassword")}</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>{t("settings.newPassword")}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("settings.newPassword")}
              />
            </div>

            <div className="form-group">
              <label>{t("settings.confirmPassword")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("settings.confirmPassword")}
              />
            </div>

            <button type="submit" disabled={loading} className="settings-btn">
              {loading ? t("common.loading") : t("settings.changeBtn")}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="settings-section">
          <h2>{t("settings.profileSettings")}</h2>
          <div className="info-item">
            <span className="info-label">{t("auth.email")}:</span>
            <span className="info-value">{currentUser.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">{t("settings.displayName")}:</span>
            <span className="info-value">{currentUser.displayName || t("common.loading")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
