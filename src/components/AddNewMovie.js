import { useEffect, useState } from "react";
import "./AddNewMovie.css";

const currentYear = new Date().getFullYear();

const AddNewMovie = ({
  isOpen,
  mode,
  categories,
  defaultCategoryKey,
  initialMovie,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [year, setYear] = useState(String(currentYear));
  const [rating, setRating] = useState("7.2");
  const [language, setLanguage] = useState("EN");
  const [genreInput, setGenreInput] = useState("");
  const [categoryKey, setCategoryKey] = useState(defaultCategoryKey);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && initialMovie) {
      setTitle(initialMovie.title || "");
      setOverview(initialMovie.overview || "");
      setImageUrl(initialMovie.posterPath || initialMovie.backdropPath || "");
      setYear(String(initialMovie.year || currentYear));
      setRating(String(Number(initialMovie.rating || 0).toFixed(1)));
      setLanguage(initialMovie.language || "EN");
      setGenreInput((initialMovie.genres || []).join(", "));
      setCategoryKey(initialMovie.categoryKey || defaultCategoryKey);
      setError("");
      return;
    }

    setTitle("");
    setOverview("");
    setImageUrl("");
    setYear(String(currentYear));
    setRating("7.2");
    setLanguage("EN");
    setGenreInput("");
    setCategoryKey(defaultCategoryKey);
    setError("");
  }, [defaultCategoryKey, initialMovie, isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const ratingValue = Number(rating);
    if (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
      setError("Rating must be between 0 and 10.");
      return;
    }

    const yearValue = Number(year);
    if (Number.isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear + 3) {
      setError(`Year should be between 1900 and ${currentYear + 3}.`);
      return;
    }

    onSubmit({
      mode,
      movieKey: initialMovie?.movieKey || "",
      categoryKey,
      title,
      overview,
      imageUrl,
      year: yearValue,
      rating: ratingValue,
      language,
      genres: genreInput.split(","),
    });
  };

  return (
    <div className="form-modal__backdrop" onClick={onClose}>
      <div
        className="form-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "edit" ? "Edit title" : "Add custom title"}
      >
        <header className="form-modal__header">
          <h3>{mode === "edit" ? "Edit Title" : "Add Custom Title"}</h3>
          <button type="button" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </header>

        <form className="form-modal__body" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Blade Runner: Redux"
              maxLength={120}
            />
          </label>

          <label>
            Overview
            <textarea
              value={overview}
              onChange={(event) => setOverview(event.target.value)}
              placeholder="What makes this title worth adding?"
              rows={4}
              maxLength={420}
            />
          </label>

          <div className="form-modal__grid">
            <label>
              Release Year
              <input
                type="number"
                min="1900"
                max={String(currentYear + 3)}
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </label>
            <label>
              Rating (0-10)
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              />
            </label>
          </div>

          <div className="form-modal__grid">
            <label>
              Language
              <input
                type="text"
                maxLength={3}
                value={language}
                onChange={(event) => setLanguage(event.target.value.toUpperCase())}
                placeholder="EN"
              />
            </label>

            {mode === "add" ? (
              <label>
                Category
                <select
                  value={categoryKey}
                  onChange={(event) => setCategoryKey(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <label>
            Genres (comma separated)
            <input
              type="text"
              value={genreInput}
              onChange={(event) => setGenreInput(event.target.value)}
              placeholder="Sci-Fi, Thriller, Neo-noir"
            />
          </label>

          <label>
            Image URL
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://image.tmdb.org/t/p/original/..."
            />
          </label>

          {error ? <p className="form-modal__error">{error}</p> : null}

          <footer className="form-modal__actions">
            <button type="button" className="form-btn form-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-btn form-btn--solid">
              {mode === "edit" ? "Save Changes" : "Add Title"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddNewMovie;
