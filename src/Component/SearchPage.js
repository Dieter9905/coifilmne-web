import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies, IMAGE_BASE_URL } from "../services/tmdbApi";
import "../Css/SearchPage.css";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    searchMovies(query)
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="search-page">
      <h2 className="search-title">
        Search results for: <span>{query}</span>
      </h2>

      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "/no-image.png"
                }
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.slice(0, 4)}</p>
                <span className="rating">⭐ {movie.vote_average}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
