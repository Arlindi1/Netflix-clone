import "./Header.css";

const truncate = (text, maxLength) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trim()}...`;
};

const Header = ({
  movie,
  isLoading,
  onToggleFavorite,
  onToggleMyList,
  onMoreInfo,
  onSurprise,
}) => {
  return (
    <header
      className="hero"
      style={
        movie?.backdropPath
          ? {
              backgroundImage: `linear-gradient(to right, rgba(6, 9, 22, 0.94) 0%, rgba(6, 9, 22, 0.74) 45%, rgba(6, 9, 22, 0.2) 100%), url("${movie.backdropPath}")`,
            }
          : undefined
      }
    >
      <div className="hero__noise" />
      <div className="hero__content">
        <p className="hero__eyebrow">Recruiter Showcase</p>
        <h1 className="hero__title">
          {isLoading ? "Loading your cinematic dashboard..." : movie?.title || "No Title Found"}
        </h1>

        <div className="hero__meta">
          <span>{movie?.year || "N/A"}</span>
          <span>{Number(movie?.rating || 0).toFixed(1)} IMDB</span>
          <span>{movie?.language || "EN"}</span>
          <span>{movie?.genres?.slice(0, 2).join(" • ") || "Featured Pick"}</span>
        </div>

        <p className="hero__description">
          {isLoading
            ? "Fetching titles, metadata, and your personalized state..."
            : truncate(
                movie?.overview ||
                  "A richer, recruiter-ready Netflix clone with custom curation, search, and persistence.",
                220
              )}
        </p>

        <div className="hero__actions">
          <button type="button" className="hero-btn hero-btn--primary">
            Play
          </button>
          <button
            type="button"
            className="hero-btn hero-btn--secondary"
            onClick={() => movie && onToggleMyList(movie)}
            disabled={!movie}
          >
            {movie?.inMyList ? "Remove from My List" : "Add to My List"}
          </button>
          <button
            type="button"
            className="hero-btn hero-btn--secondary"
            onClick={() => movie && onToggleFavorite(movie)}
            disabled={!movie}
          >
            {movie?.isFavorite ? "Favorited" : "Favorite"}
          </button>
          <button
            type="button"
            className="hero-btn hero-btn--ghost"
            onClick={() => movie && onMoreInfo(movie)}
            disabled={!movie}
          >
            More Info
          </button>
          <button type="button" className="hero-btn hero-btn--ghost" onClick={onSurprise}>
            Surprise Me
          </button>
        </div>
      </div>
      <div className="hero__fade" />
    </header>
  );
};

export default Header;
