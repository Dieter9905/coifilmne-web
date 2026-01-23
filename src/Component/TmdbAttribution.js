import { t } from "../i18n/translations";
import "../Css/TmdbAttribution.css";
import tmdbLogo from "../Images/tmdb-logo.svg";
import appLogo from "../Images/logo.jpg";

function TmdbAttribution() {
  return (
    <footer className="footer-container">
      {/* Top Section */}
      <div className="footer-content">
        {/* Left - App Info */}
        <div className="footer-section footer-app-info">
          <div className="footer-logo-section">
            <img src={appLogo} alt="CoiFilm Logo" className="footer-app-logo" />
            <div>
              <h3>CoiFilm</h3>
              <p>{t("hero.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Center - Links */}
        <div className="footer-section footer-links">
          <h4>{t("footer.terms")}</h4>
          <ul>
            <li><a href="#terms">{t("footer.terms")}</a></li>
            <li><a href="#privacy">{t("footer.privacy")}</a></li>
            <li><a href="#contact">{t("footer.contact")}</a></li>
          </ul>
        </div>

        {/* Right - TMDB Attribution */}
        <div className="footer-section footer-tmdb">
          <img src={tmdbLogo} alt="TMDB Logo" className="tmdb-logo-small" />
          <p className="tmdb-text">{t("footer.tmdbAttribution")}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-creator">
          <p>© 2026 CoiFilm • {t("footer.creator")}</p>
        </div>
      </div>
    </footer>
  );
}

export default TmdbAttribution;
