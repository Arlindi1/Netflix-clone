import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faHeart,
  faListCheck,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import "./Category.css";

const Category = ({
  title,
  subtitle,
  accent,
  movies,
  onToggleFavorite,
  onToggleMyList,
  onOpenDetails,
  onEditMovie,
  onDeleteMovie,
  onAddMovie,
  showAddButton = true,
}) => {
  const railRef = useRef(null);

  const scrollRail = (direction) => {
    if (!railRef.current) {
      return;
    }

    railRef.current.scrollBy({
      left: direction * railRef.current.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="category">
      <header className="category__header">
        <div>
          <h2 style={{ "--category-accent": accent }}>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="category__header-actions">
          <span>{movies.length} titles</span>
          {showAddButton ? (
            <button type="button" className="category__add-button" onClick={onAddMovie}>
              <FontAwesomeIcon icon={faPlus} />
              Add Title
            </button>
          ) : null}
        </div>
      </header>

      <div className="category__rail-wrap">
        <button
          type="button"
          className="category__scroll-button"
          onClick={() => scrollRail(-1)}
          aria-label={`Scroll ${title} left`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="category__rail" ref={railRef}>
          {movies.map((movie) => (
            <article
              key={`${movie.movieKey}-${title}`}
              className="category-card"
              onClick={() => onOpenDetails(movie)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onOpenDetails(movie);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {movie.posterPath || movie.backdropPath ? (
                <img src={movie.posterPath || movie.backdropPath} alt={movie.title} />
              ) : (
                <div className="category-card__placeholder">{movie.title.slice(0, 1)}</div>
              )}

              <div className="category-card__overlay">
                <div className="category-card__meta">
                  <h3>{movie.title}</h3>
                  <p>
                    {movie.year} • {Number(movie.rating || 0).toFixed(1)} •{" "}
                    {movie.genres[0] || "Drama"}
                  </p>
                </div>

                <div className="category-card__actions">
                  <button
                    type="button"
                    aria-label={`${
                      movie.inMyList ? "Remove from my list" : "Add to my list"
                    } ${movie.title}`}
                    className={movie.inMyList ? "is-active" : ""}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleMyList(movie);
                    }}
                  >
                    <FontAwesomeIcon icon={faListCheck} />
                  </button>
                  <button
                    type="button"
                    aria-label={`${movie.isFavorite ? "Unfavorite" : "Favorite"} ${movie.title}`}
                    className={movie.isFavorite ? "is-active" : ""}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleFavorite(movie);
                    }}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit ${movie.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditMovie(movie);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${movie.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteMovie(movie);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                  <button
                    type="button"
                    aria-label={`More info for ${movie.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDetails(movie);
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="category__scroll-button"
          onClick={() => scrollRail(1)}
          aria-label={`Scroll ${title} right`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
};

export default Category;
