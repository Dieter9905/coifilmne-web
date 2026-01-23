import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { getMovieDetails, getMovieRecommendations, IMAGE_BASE_URL } from "../services/tmdbApi";
import { getVietsub, convertSrtToVtt, getSubtitleBlobUrl } from "../services/subtitleService";
import { t } from "../i18n/translations";
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
  const [showSubtitle, setShowSubtitle] = useState(true); // Add subtitle toggle
  const [subtitleUrl, setSubtitleUrl] = useState(null); // Subtitle blob URL
  const [loadingSubtitle, setLoadingSubtitle] = useState(false);

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

        // Tìm vietsub
        if (movieData.title && movieData.release_date) {
          fetchVietsub(movieData.title, movieData.release_date.split('-')[0]);
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

  const fetchVietsub = async (title, year) => {
    setLoadingSubtitle(true);
    try {
      const subtitleData = await getVietsub(title, year);
      if (subtitleData && subtitleData.url) {
        // Fetch subtitle file
        const response = await fetch(subtitleData.url);
        let content = await response.text();
        
        // Convert SRT to VTT if needed
        if (content.includes('-->') && !content.startsWith('WEBVTT')) {
          content = convertSrtToVtt(content);
        }
        
        // Create blob URL
        const blobUrl = getSubtitleBlobUrl(content);
        setSubtitleUrl(blobUrl);
        console.log('Vietsub loaded successfully');
      }
    } catch (error) {
      console.log('Error loading vietsub:', error);
    }
    setLoadingSubtitle(false);
  };

  if (loading) return <div className="loading">{t("movieDetail.loading")}</div>;
  if (!movie) return <div className="loading">{t("movieDetail.notFound")}</div>;

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 5) || [];
  const vidsrcUrl = `https://vidsrc.me/embed/movie/${id}${showSubtitle ? "?sub=1" : ""}`;

  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        {t("movieDetail.back")}
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
                <div className="player-no-content">{t("movieDetail.noTrailer")}</div>
              )
            ) : subtitleUrl && showSubtitle ? (
              <video
                key={`${id}-${showSubtitle}`}
                width="100%"
                height="100%"
                controls
                autoPlay
                className="vidsrc-player"
              >
                <source src={vidsrcUrl.split('?')[0]} type="video/mp4" />
                <track
                  kind="subtitles"
                  src={subtitleUrl}
                  srcLang="vi"
                  label="Vietsub"
                  default
                />
                {t("movieDetail.noTrailer")}
              </video>
            ) : (
              <iframe
                key={`${id}-${showSubtitle}`}
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
                  {t("movieDetail.trailer")}
                </button>
              )}
              <button
                className={`player-tab ${playerMode === "vidsrc" ? "active" : ""}`}
                onClick={() => setPlayerMode("vidsrc")}
              >
                {t("movieDetail.watchMovie")}
              </button>
              {playerMode === "vidsrc" && (
                <button
                  className={`player-tab ${showSubtitle && subtitleUrl ? "active" : ""}`}
                  onClick={() => setShowSubtitle(!showSubtitle)}
                  title={showSubtitle ? t("movieDetail.disableSubtitle") : t("movieDetail.enableSubtitle")}
                  disabled={loadingSubtitle || !subtitleUrl}
                  style={{ opacity: subtitleUrl ? 1 : 0.5, cursor: subtitleUrl ? "pointer" : "not-allowed" }}
                >
                  {loadingSubtitle ? "⏳" : t("movieDetail.vietsub")}
                </button>
              )}
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
            <span className="runtime">{t("movieDetail.duration")} {movie.runtime} {t("movieDetail.minutes")}</span>
          </div>

          <div className="genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="description">
            <h3>{t("movieDetail.content")}</h3>
            <p>{movie.overview}</p>
          </div>

          {director && (
            <div className="director">
              <h4>{t("movieDetail.director")}</h4>
              <p>{director.name}</p>
            </div>
          )}

          {cast.length > 0 && (
            <div className="cast">
              <h4>{t("movieDetail.cast")}</h4>
              <div className="cast-list">
                {cast.map((actor) => (
                  <span key={actor.id}>{actor.name}</span>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            {!isPlayerOpen && (
              <>
                <button
                  className="play-movie-btn"
                  onClick={() => {
                    setIsPlayerOpen(true);
                    setPlayerMode("vidsrc");
                  }}
                >
                  {t("movieDetail.watchMovie")}
                </button>
                {trailer && (
                  <button
                    className="watch-trailer-btn"
                    onClick={() => {
                      setIsPlayerOpen(true);
                      setPlayerMode("trailer");
                    }}
                  >
                    {t("movieDetail.trailer")}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>{t("movieDetail.relatedMovies")}</h2>
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
