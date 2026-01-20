import "../Css/TmdbAttribution.css";
import tmdbLogo from "../Images/tmdb-logo.svg";

function TmdbAttribution() {
  return (
    <footer className="tmdb-footer">
      <img src={tmdbLogo} alt="TMDB Logo" />
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}

export default TmdbAttribution;
