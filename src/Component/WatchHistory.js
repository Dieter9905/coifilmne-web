import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/WatchHistory.css";

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWatchHistory();
  }, [navigate]);

  const fetchWatchHistory = async () => {
    try {
      const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUserData) return;

      // Lấy history từ localStorage (vì chúng ta chưa setup Firestore collection)
      const watchHistoryData = JSON.parse(localStorage.getItem("watchHistory")) || [];
      setHistory(watchHistoryData);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Bạn chắc chắn muốn xóa toàn bộ lịch sử xem?")) {
      localStorage.removeItem("watchHistory");
      setHistory([]);
    }
  };

  const removeFromHistory = (movieId) => {
    const updated = history.filter(item => item.movieId !== movieId);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="watch-history-container">
      <div className="watch-history-content">
        <div className="history-header">
          <h1>📺 Lịch Sử Xem</h1>
          {history.length > 0 && (
            <button onClick={clearHistory} className="clear-btn">
              Xóa toàn bộ
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa xem bộ phim nào</p>
            <button onClick={() => navigate("/")} className="go-home-btn">
              Quay về trang chủ
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item.movieId} className="history-item">
                <div className="history-poster">
                  <img 
                    src={item.posterPath} 
                    alt={item.title}
                    onClick={() => navigate(`/movie/${item.movieId}`)}
                  />
                  <div className="history-overlay">
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromHistory(item.movieId)}
                      title="Xóa khỏi lịch sử"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="history-info">
                  <p className="history-title">{item.title}</p>
                  <p className="history-date">
                    {new Date(item.watchedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchHistory;
