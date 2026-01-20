import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "../Css/MovieSection.css";

function MovieSection({ id, title, fetchData }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!fetchData) return;

    const loadMovies = async () => {
      try {
        const data = await fetchData();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadMovies();
  }, [fetchData]);

  return (
    <section id={id} className="movie-section">
      <h2>{title}</h2>

      <div className="movie-row">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;
