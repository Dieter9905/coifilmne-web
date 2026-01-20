import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero";
import MovieSection from "./Component/MovieSection";
import SearchPage from "./Component/SearchPage";
import MovieDetail from "./Component/MovieDetail";
import Popular from "./Component/Popular";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import Settings from "./Component/Settings";
import WatchHistory from "./Component/WatchHistory";
import TmdbAttribution from "./Component/TmdbAttribution";

import { GENRES, getMoviesByGenre } from "./services/tmdbApi";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero id="hero" />

              <Popular id="popular" />

              <MovieSection
                id="action"
                title="🎬 Action Movies"
                fetchData={() => getMoviesByGenre(GENRES.ACTION)}
              />

              <MovieSection
                id="comedy"
                title="😂 Comedy Movies"
                fetchData={() => getMoviesByGenre(GENRES.COMEDY)}
              />

              <MovieSection
                id="romance"
                title="💖 Romance Movies"
                fetchData={() => getMoviesByGenre(GENRES.ROMANCE)}
              />
            </>
          }
        />

        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/watch-history" element={<WatchHistory />} />
      </Routes>
      <TmdbAttribution />
    </>
  );
}

export default App;
