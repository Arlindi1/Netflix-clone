import "./EditMovieModal.css";

const EditMovieModal = ({
  isOpen,
  movie,
  onClose,
  onToggleFavorite,
  onToggleMyList,
  onEditMovie,
  onDeleteMovie,
}) => {
  if (!isOpen || !movie) {
    return null;
  }

  return (
    <div className="detail-modal__backdrop" onClick={onClose}>
      <div
        className="detail-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${movie.title} details`}
      >
        <figure
          className="detail-modal__media"
          style={
            movie.backdropPath || movie.posterPath
              ? {
                  backgroundImage: `linear-gradient(to top, rgba(7, 11, 29, 0.9), rgba(7, 11, 29, 0.4)), url("${
                    movie.backdropPath || movie.posterPath
                  }")`,
                }
              : undefined
          }
        >
          <button type="button" className="detail-modal__close" onClick={onClose}>
            x
          </button>
          <div className="detail-modal__title-group">
            <p>Title Details</p>
            <h3>{movie.title}</h3>
          </div>
        </figure>

        <div className="detail-modal__content">
          <p className="detail-modal__overview">{movie.overview}</p>

          <div className="detail-modal__metadata">
            <span>{movie.year}</span>
            <span>{Number(movie.rating || 0).toFixed(1)} Rating</span>
            <span>{movie.language}</span>
            <span>{movie.genres.join(" • ") || "Uncategorized"}</span>
          </div>

          <div className="detail-modal__actions">
            <button type="button" onClick={() => onToggleMyList(movie)}>
              {movie.inMyList ? "Remove from My List" : "Add to My List"}
            </button>
            <button type="button" onClick={() => onToggleFavorite(movie)}>
              {movie.isFavorite ? "Unfavorite" : "Favorite"}
            </button>
            <button type="button" onClick={() => onEditMovie(movie)}>
              Edit
            </button>
            <button type="button" onClick={() => onDeleteMovie(movie)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
