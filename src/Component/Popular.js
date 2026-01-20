import React, { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdbApi";
import MovieCard from "./MovieCard";
import "../Css/Popular.css";

function Popular({ id }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getPopularMovies()
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
      })
      .catch((err) => console.error('Error fetching popular movies:', err));
  }, []);

  return (
    <section id={id} className="popular-section">
      <h2>Popular Movies</h2>
      <div className="popular-grid">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
          />
        ))}
      </div>
    </section>
  );
}

export default Popular;
