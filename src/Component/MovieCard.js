import React from "react";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../services/tmdbApi";
import "../Css/MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img
        src={
          movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "/no-image.png"
        }
        alt={movie.title}
      />

      <div className="movie-info">
        <h4>{movie.title}</h4>
        <span>{movie.release_date?.slice(0, 4)}</span>
      </div>
    </div>
  );
}

export default MovieCard;
