import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import "../Css/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Lưu user info vào localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0]
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      // Phát event để Navbar cập nhật
      window.dispatchEvent(new Event("userLoggedIn"));
      
      navigate("/");
    } catch (err) {
      // Xử lý các lỗi Firebase
      if (err.code === "auth/user-not-found") {
        setError("Email không tồn tại");
      } else if (err.code === "auth/wrong-password") {
        setError("Mật khẩu không chính xác");
      } else if (err.code === "auth/invalid-email") {
        setError("Email không hợp lệ");
      } else {
        setError("Đăng nhập thất bại: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/signup">Đăng ký tại đây</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
