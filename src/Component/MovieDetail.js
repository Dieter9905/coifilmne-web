import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { getMovieDetails, getMovieRecommendations, IMAGE_BASE_URL } from "../services/tmdbApi";
import MovieCard from "./MovieCard";
import "../Css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState("trailer"); // "trailer" or "vidsrc"

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMovieDetails(id),
      getMovieRecommendations(id)
    ])
      .then(([movieData, recData]) => {
        setMovie(movieData);
        if (recData && recData.results) {
          setRecommendations(recData.results.slice(0, 6));
        }
        
        // Tìm video trailer
        if (movieData.videos && movieData.videos.results) {
          const youtubeTrailer = movieData.videos.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          if (youtubeTrailer) {
            setTrailer(youtubeTrailer);
          }
        }

        // Thêm vào watch history
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const watchHistory = JSON.parse(localStorage.getItem("watchHistory")) || [];
          const isExists = watchHistory.some(item => item.movieId === parseInt(id));
          
          if (!isExists) {
            const newHistoryItem = {
              movieId: movieData.id,
              title: movieData.title,
              posterPath: movieData.poster_path ? `${IMAGE_BASE_URL}${movieData.poster_path}` : "",
              watchedAt: new Date().toISOString()
            };
            watchHistory.unshift(newHistoryItem);
            localStorage.setItem("watchHistory", JSON.stringify(watchHistory.slice(0, 50))); // Giữ 50 mục gần nhất
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movie details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="loading">Movie not found</div>;

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 5) || [];
  const vidsrcUrl = `https://vidsrc.me/embed/movie/${id}`;

  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {isPlayerOpen && (
        <div className="player-modal">
          <div className="player-container">
            <button
              className="close-player"
              onClick={() => setIsPlayerOpen(false)}
            >
              ✕
            </button>
            
            {playerMode === "trailer" ? (
              trailer ? (
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${trailer.key}`}
                  playing
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    }
                  }}
                />
              ) : (
                <div className="player-no-content">Không có trailer</div>
              )
            ) : (
              <iframe
                src={vidsrcUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title={movie.title}
                className="vidsrc-player"
              />
            )}

            <div className="player-tabs">
              {trailer && (
                <button
                  className={`player-tab ${playerMode === "trailer" ? "active" : ""}`}
                  onClick={() => setPlayerMode("trailer")}
                >
                  📹 Trailer
                </button>
              )}
              <button
                className={`player-tab ${playerMode === "vidsrc" ? "active" : ""}`}
                onClick={() => setPlayerMode("vidsrc")}
              >
                ▶ Xem Phim
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="detail-banner"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
        }}
      >
        <div className="detail-overlay"></div>
      </div>

      <div className="detail-content">
        <div className="detail-poster">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "/no-image.png"
            }
            alt={movie.title}
          />
        </div>

        <div className="detail-info">
          <h1>{movie.title}</h1>

          <div className="detail-meta">
            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="year">📅 {movie.release_date?.slice(0, 4)}</span>
            <span className="runtime">⏱ {movie.runtime} phút</span>
          </div>

          <div className="genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="description">
            <h3>Nội dung</h3>
            <p>{movie.overview}</p>
          </div>

          {director && (
            <div className="director">
              <h4>Đạo diễn:</h4>
              <p>{director.name}</p>
            </div>
          )}

          {cast.length > 0 && (
            <div className="cast">
              <h4>Diễn viên:</h4>
              <div className="cast-list">
                {cast.map((actor) => (
                  <span key={actor.id}>{actor.name}</span>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="play-movie-btn"
              onClick={() => {
                setIsPlayerOpen(true);
                setPlayerMode("vidsrc");
              }}
            >
              ▶ Xem Phim
            </button>
            {trailer && (
              <button
                className="watch-trailer-btn"
                onClick={() => {
                  setIsPlayerOpen(true);
                  setPlayerMode("trailer");
                }}
              >
                📹 Xem Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>Phim Liên Quan</h2>
          <div className="recommendations-grid">
            {recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
