import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularMovies, IMAGE_BASE_URL } from "../services/tmdbApi";
import "../Css/Hero.css";

function Hero({ id }) {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        if (data && data.results && data.results.length > 0) {
          setFeaturedMovie(data.results[0]);
        }
      })
      .catch((err) => console.error("Error fetching featured movie:", err));
  }, []);

  if (!featuredMovie) return null;

  return (
    <section
      id={id}
      className="hero"
      style={{
        backgroundImage: `url(${IMAGE_BASE_URL}${featuredMovie.backdrop_path})`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="badge">🔥 Featured Movie</span>
        <h1>{featuredMovie.title}</h1>
        <div className="movie-info">
          <span>⭐ {featuredMovie.vote_average?.toFixed(1)}</span>
          <span>📅 {featuredMovie.release_date?.slice(0, 4)}</span>
          <span className="tag">Featured</span>
        </div>
        <p className="description">
          {featuredMovie.overview?.substring(0, 150)}...
        </p>
        <div className="hero-buttons">
          <button
            className="btn-play"
            onClick={() => navigate(`/movie/${featuredMovie.id}`)}
          >
            ▶ Watch Now
          </button>
          <button
            className="btn-info"
            onClick={() => navigate(`/movie/${featuredMovie.id}`)}
          >
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
