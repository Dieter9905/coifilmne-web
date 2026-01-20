import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "vi-VN",
  },
});

// GENRES
export const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  ROMANCE: 10749,
};

// POPULAR (cho HERO)
export const getPopularMovies = async () => {
  const res = await api.get("/movie/popular");
  return res.data;
};

// THEO THỂ LOẠI
export const getMoviesByGenre = async (genreId) => {
  const res = await api.get("/discover/movie", {
    params: { with_genres: genreId },
  });
  return res.data;
};

// SEARCH
export const searchMovies = async (query) => {
  const res = await api.get("/search/movie", {
    params: { query },
  });
  return res.data;
};

// RECOMMEND
export const getMovieRecommendations = async (movieId) => {
  const res = await api.get(`/movie/${movieId}/recommendations`);
  return res.data;
};

// CHI TIẾT PHIM
export const getMovieDetails = async (movieId) => {
  const res = await api.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "credits,videos",
    },
  });
  return res.data;
};
