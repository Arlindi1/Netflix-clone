import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import axios from "./axios";
import {
  CATEGORY_DEFINITIONS,
  GENRE_LOOKUP,
  IMAGE_BASE_URL,
} from "./request";
import AddNewMovie from "./components/AddNewMovie";
import Category from "./components/Category/Category";
import EditMovieModal from "./components/EditMovieModal/EditMovieModal";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";

const USER_MOVIE_STATE_KEY = "netflix_clone_user_movie_state_v2";
const CUSTOM_MOVIES_KEY = "netflix_clone_custom_movies_v2";

const readStorage = (key, fallback) => {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
};

const uniqueByMovieKey = (movies) => {
  const map = new Map();

  movies.forEach((movie) => {
    if (!movie || movie.isHidden || map.has(movie.movieKey)) {
      return;
    }

    map.set(movie.movieKey, movie);
  });

  return Array.from(map.values());
};

const randomFromList = (items) => {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
};

const normalizeMovie = (movie, categoryKey, movieStateByKey) => {
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const movieKey = `${type}-${movie.id}`;
  const persistedState = movieStateByKey[movieKey] || {};

  const title =
    persistedState.title ||
    movie.title ||
    movie.name ||
    movie.original_name ||
    "Untitled";
  const overview =
    persistedState.overview ||
    movie.overview ||
    "No synopsis available yet for this title.";

  const releaseDate = movie.release_date || movie.first_air_date || "";
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const year = persistedState.year || releaseYear;

  const ratingValue = persistedState.rating ?? movie.vote_average ?? 0;
  const rating = Number.isFinite(Number(ratingValue))
    ? Number(ratingValue)
    : 0;

  const posterPath =
    persistedState.posterPath ||
    (movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "");
  const backdropPath =
    persistedState.backdropPath ||
    (movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : posterPath);

  const genresFromApi = (movie.genre_ids || [])
    .map((genreId) => GENRE_LOOKUP[genreId])
    .filter(Boolean);
  const genres =
    Array.isArray(persistedState.genres) && persistedState.genres.length
      ? persistedState.genres
      : genresFromApi;

  return {
    id: movie.id,
    tmdbId: movie.id,
    type,
    movieKey,
    categoryKey,
    title,
    overview,
    posterPath,
    backdropPath,
    releaseDate,
    year,
    rating,
    language: (persistedState.language || movie.original_language || "en").toUpperCase(),
    genres,
    isFavorite: Boolean(persistedState.isFavorite),
    inMyList: Boolean(persistedState.inMyList),
    isCustom: false,
    isHidden: Boolean(persistedState.isHidden),
  };
};

const normalizeCustomMovie = (entry, movieStateByKey) => {
  const baseMovie = entry.movie || {};
  const movieKey = baseMovie.movieKey || `custom-${Date.now()}`;
  const persistedState = movieStateByKey[movieKey] || {};
  const posterPath = persistedState.posterPath || baseMovie.posterPath || "";
  const backdropPath = persistedState.backdropPath || baseMovie.backdropPath || posterPath;

  return {
    id: baseMovie.id || movieKey,
    tmdbId: null,
    type: "custom",
    movieKey,
    categoryKey: entry.categoryKey,
    title: persistedState.title || baseMovie.title || "Untitled",
    overview:
      persistedState.overview ||
      baseMovie.overview ||
      "A custom entry created in your showcase.",
    posterPath,
    backdropPath,
    releaseDate: baseMovie.releaseDate || "",
    year: persistedState.year || baseMovie.year || "N/A",
    rating: Number(persistedState.rating ?? baseMovie.rating ?? 0),
    language: (persistedState.language || baseMovie.language || "EN").toUpperCase(),
    genres:
      (Array.isArray(persistedState.genres) && persistedState.genres.length
        ? persistedState.genres
        : baseMovie.genres) || [],
    isFavorite: Boolean(persistedState.isFavorite || baseMovie.isFavorite),
    inMyList: Boolean(persistedState.inMyList || baseMovie.inMyList),
    isCustom: true,
    isHidden: Boolean(persistedState.isHidden),
  };
};

function App() {
  const [movieStateByKey, setMovieStateByKey] = useState(() =>
    readStorage(USER_MOVIE_STATE_KEY, {})
  );
  const [customMovies, setCustomMovies] = useState(() =>
    readStorage(CUSTOM_MOVIES_KEY, [])
  );
  const initialMovieStateRef = useRef(movieStateByKey);
  const initialCustomMoviesRef = useRef(customMovies);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showMyListOnly, setShowMyListOnly] = useState(false);

  const [featuredMovieKey, setFeaturedMovieKey] = useState("");
  const [selectedMovieKey, setSelectedMovieKey] = useState("");
  const [editingMovieKey, setEditingMovieKey] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultCategoryKey, setDefaultCategoryKey] = useState(
    CATEGORY_DEFINITIONS[0].key
  );

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCatalog = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const responses = await Promise.allSettled(
          CATEGORY_DEFINITIONS.map((definition) => axios.get(definition.fetchUrl))
        );

        if (!isMounted) {
          return;
        }

        const nextCategories = CATEGORY_DEFINITIONS.map((definition, index) => {
          const response = responses[index];
          const apiMovies =
            response.status === "fulfilled"
              ? (response.value.data?.results || []).map((movie) =>
                  normalizeMovie(
                    movie,
                    definition.key,
                    initialMovieStateRef.current
                  )
                )
              : [];

          const localMovies = initialCustomMoviesRef.current
            .filter((item) => item.categoryKey === definition.key)
            .map((entry) =>
              normalizeCustomMovie(entry, initialMovieStateRef.current)
            );

          return {
            ...definition,
            movies: [...localMovies, ...apiMovies],
          };
        });

        setCategories(nextCategories);

        const catalogSnapshot = uniqueByMovieKey(
          nextCategories.flatMap((category) => category.movies)
        );
        const spotlightPick = randomFromList(catalogSnapshot);
        if (spotlightPick) {
          setFeaturedMovieKey(spotlightPick.movieKey);
        }

        const hasAnyFailures = responses.some(
          (response) => response.status === "rejected"
        );
        if (hasAnyFailures) {
          setErrorMessage(
            "Some categories could not be loaded right now. The app is still usable."
          );
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            "We could not load titles from TMDB. Check your network/API key and refresh."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      USER_MOVIE_STATE_KEY,
      JSON.stringify(movieStateByKey)
    );
  }, [movieStateByKey]);

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(customMovies));
  }, [customMovies]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const catalogMovies = useMemo(
    () => uniqueByMovieKey(categories.flatMap((category) => category.movies)),
    [categories]
  );

  const featuredMovie = useMemo(
    () => catalogMovies.find((movie) => movie.movieKey === featuredMovieKey) || null,
    [catalogMovies, featuredMovieKey]
  );

  const selectedMovie = useMemo(() => {
    if (!selectedMovieKey) {
      return null;
    }

    for (const category of categories) {
      const match = category.movies.find((movie) => movie.movieKey === selectedMovieKey);
      if (match) {
        return match;
      }
    }

    return null;
  }, [categories, selectedMovieKey]);

  const editingMovie = useMemo(() => {
    if (!editingMovieKey) {
      return null;
    }

    for (const category of categories) {
      const match = category.movies.find((movie) => movie.movieKey === editingMovieKey);
      if (match) {
        return match;
      }
    }

    return null;
  }, [categories, editingMovieKey]);

  const availableGenres = useMemo(() => {
    const genres = new Set();

    catalogMovies.forEach((movie) => {
      movie.genres.forEach((genre) => genres.add(genre));
    });

    return ["All", ...Array.from(genres).sort((a, b) => a.localeCompare(b))];
  }, [catalogMovies]);

  const filteredCategories = useMemo(
    () => {
      const normalizedQuery = searchQuery.trim().toLowerCase();

      return (
      categories
        .map((category) => ({
          ...category,
          movies: category.movies.filter(
            (movie) => {
              if (movie.isHidden) {
                return false;
              }

              if (selectedGenre !== "All" && !movie.genres.includes(selectedGenre)) {
                return false;
              }

              if (showMyListOnly && !movie.inMyList) {
                return false;
              }

              if (!normalizedQuery) {
                return true;
              }

              const haystack = `${movie.title} ${movie.overview}`.toLowerCase();
              return haystack.includes(normalizedQuery);
            }
          ),
        }))
        .filter((category) => category.movies.length)
      );
    },
    [categories, searchQuery, selectedGenre, showMyListOnly]
  );

  const continueWatching = useMemo(
    () =>
      uniqueByMovieKey(
        categories.flatMap((category) =>
          category.movies.filter((movie) => movie.inMyList && !movie.isHidden)
        )
      ).slice(0, 12),
    [categories]
  );

  const hiddenCount = useMemo(
    () =>
      Object.values(movieStateByKey).reduce(
        (count, movieState) => count + (movieState.isHidden ? 1 : 0),
        0
      ),
    [movieStateByKey]
  );

  const stats = useMemo(() => {
    const favoriteCount = catalogMovies.filter((movie) => movie.isFavorite).length;
    const myListCount = catalogMovies.filter((movie) => movie.inMyList).length;
    const avgRating = catalogMovies.length
      ? (
          catalogMovies.reduce((sum, movie) => sum + Number(movie.rating || 0), 0) /
          catalogMovies.length
        ).toFixed(1)
      : "0.0";

    return {
      titleCount: catalogMovies.length,
      favoriteCount,
      myListCount,
      avgRating,
    };
  }, [catalogMovies]);

  useEffect(() => {
    if (!catalogMovies.length) {
      return;
    }

    const hasFeaturedMovie = catalogMovies.some(
      (movie) => movie.movieKey === featuredMovieKey
    );

    if (!hasFeaturedMovie) {
      const nextMovie = randomFromList(catalogMovies);
      if (nextMovie) {
        setFeaturedMovieKey(nextMovie.movieKey);
      }
    }
  }, [catalogMovies, featuredMovieKey]);

  const patchMovieEverywhere = (movieKey, updater) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        movies: category.movies.map((movie) =>
          movie.movieKey === movieKey ? updater(movie) : movie
        ),
      }))
    );
  };

  const updatePersistedMovieState = (movieKey, updates) => {
    setMovieStateByKey((prevState) => ({
      ...prevState,
      [movieKey]: {
        ...(prevState[movieKey] || {}),
        ...updates,
      },
    }));
  };

  const handleToggleFavorite = (movie) => {
    const nextFavoriteState = !movie.isFavorite;

    patchMovieEverywhere(movie.movieKey, (currentMovie) => ({
      ...currentMovie,
      isFavorite: nextFavoriteState,
    }));

    updatePersistedMovieState(movie.movieKey, {
      isFavorite: nextFavoriteState,
    });
  };

  const handleToggleMyList = (movie) => {
    const nextListState = !movie.inMyList;

    patchMovieEverywhere(movie.movieKey, (currentMovie) => ({
      ...currentMovie,
      inMyList: nextListState,
    }));

    updatePersistedMovieState(movie.movieKey, {
      inMyList: nextListState,
    });
  };

  const openAddMovieModal = (categoryKey = CATEGORY_DEFINITIONS[0].key) => {
    setEditingMovieKey("");
    setDefaultCategoryKey(categoryKey);
    setIsFormOpen(true);
  };

  const openEditMovieModal = (movie) => {
    setEditingMovieKey(movie.movieKey);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setEditingMovieKey("");
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formPayload) => {
    const payload = {
      ...formPayload,
      title: formPayload.title.trim(),
      overview: formPayload.overview.trim(),
      language: formPayload.language.trim() || "EN",
      genres: formPayload.genres.map((genre) => genre.trim()).filter(Boolean),
      rating: Number(formPayload.rating || 0),
      year: formPayload.year || "N/A",
    };

    if (payload.mode === "add") {
      const movieKey = `custom-${Date.now()}`;
      const customMovie = {
        id: movieKey,
        tmdbId: null,
        type: "custom",
        movieKey,
        categoryKey: payload.categoryKey,
        title: payload.title,
        overview: payload.overview || "A custom title to demonstrate product thinking.",
        posterPath: payload.imageUrl || "",
        backdropPath: payload.imageUrl || "",
        releaseDate: `${payload.year}-01-01`,
        year: payload.year,
        rating: payload.rating,
        language: payload.language.toUpperCase(),
        genres: payload.genres,
        isFavorite: false,
        inMyList: false,
        isCustom: true,
        isHidden: false,
      };

      setCustomMovies((prevCustomMovies) => [
        { categoryKey: payload.categoryKey, movie: customMovie },
        ...prevCustomMovies,
      ]);

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.key === payload.categoryKey
            ? {
                ...category,
                movies: [customMovie, ...category.movies],
              }
            : category
        )
      );

      setFeaturedMovieKey(customMovie.movieKey);
      setToastMessage(`Added "${customMovie.title}"`);
      closeFormModal();
      return;
    }

    if (!editingMovie) {
      closeFormModal();
      return;
    }

    const updatedMovieFields = {
      title: payload.title,
      overview: payload.overview || "No synopsis available yet for this title.",
      posterPath: payload.imageUrl || editingMovie.posterPath,
      backdropPath: payload.imageUrl || editingMovie.backdropPath,
      year: payload.year,
      rating: payload.rating,
      genres: payload.genres,
      language: payload.language.toUpperCase(),
      isHidden: false,
    };

    patchMovieEverywhere(editingMovie.movieKey, (currentMovie) => ({
      ...currentMovie,
      ...updatedMovieFields,
    }));

    if (editingMovie.isCustom) {
      setCustomMovies((prevCustomMovies) =>
        prevCustomMovies.map((entry) =>
          entry.movie.movieKey === editingMovie.movieKey
            ? {
                ...entry,
                movie: {
                  ...entry.movie,
                  ...updatedMovieFields,
                },
              }
            : entry
        )
      );
    } else {
      updatePersistedMovieState(editingMovie.movieKey, updatedMovieFields);
    }

    setToastMessage(`Updated "${payload.title}"`);
    closeFormModal();
  };

  const handleDeleteMovie = (movie) => {
    if (movie.isCustom) {
      setCustomMovies((prevCustomMovies) =>
        prevCustomMovies.filter((entry) => entry.movie.movieKey !== movie.movieKey)
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          movies: category.movies.filter((item) => item.movieKey !== movie.movieKey),
        }))
      );

      setMovieStateByKey((prevState) => {
        const nextState = { ...prevState };
        delete nextState[movie.movieKey];
        return nextState;
      });
    } else {
      patchMovieEverywhere(movie.movieKey, (currentMovie) => ({
        ...currentMovie,
        isHidden: true,
      }));

      updatePersistedMovieState(movie.movieKey, { isHidden: true });
    }

    if (selectedMovieKey === movie.movieKey) {
      setSelectedMovieKey("");
    }

    if (featuredMovieKey === movie.movieKey) {
      setFeaturedMovieKey("");
    }

    setToastMessage(`Removed "${movie.title}"`);
  };

  const handleRestoreHidden = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        movies: category.movies.map((movie) => ({
          ...movie,
          isHidden: false,
        })),
      }))
    );

    setMovieStateByKey((prevState) => {
      const nextState = {};

      Object.entries(prevState).forEach(([movieKey, state]) => {
        if (!state) {
          return;
        }

        const rest = { ...state };
        delete rest.isHidden;
        nextState[movieKey] = rest;
      });

      return nextState;
    });

    setToastMessage("Restored hidden titles");
  };

  const handleSurpriseMe = () => {
    const candidate = randomFromList(catalogMovies);

    if (candidate) {
      setFeaturedMovieKey(candidate.movieKey);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
    setShowMyListOnly(false);
  };

  return (
    <div className="App">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={stats.favoriteCount}
        myListCount={stats.myListCount}
        showMyListOnly={showMyListOnly}
        onToggleMyList={() => setShowMyListOnly((prev) => !prev)}
        onClearFilters={clearFilters}
      />

      <Header
        movie={featuredMovie}
        isLoading={isLoading}
        onToggleFavorite={handleToggleFavorite}
        onToggleMyList={handleToggleMyList}
        onMoreInfo={(movie) => setSelectedMovieKey(movie.movieKey)}
        onSurprise={handleSurpriseMe}
      />

      <main className="app-main">
        {errorMessage ? <p className="app-alert">{errorMessage}</p> : null}

        <section className="app-dashboard">
          <article className="metric-card">
            <p className="metric-card__label">Catalog</p>
            <p className="metric-card__value">{stats.titleCount}</p>
            <p className="metric-card__hint">Unique visible titles</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">Average Rating</p>
            <p className="metric-card__value">{stats.avgRating}</p>
            <p className="metric-card__hint">Across your current feed</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">Favorites</p>
            <p className="metric-card__value">{stats.favoriteCount}</p>
            <p className="metric-card__hint">Shortlisted by you</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">My List</p>
            <p className="metric-card__value">{stats.myListCount}</p>
            <p className="metric-card__hint">Ready to watch</p>
          </article>
        </section>

        <section className="app-controls">
          <div className="app-controls__left">
            <h2>Discover</h2>
            <p>
              Search, filter by genre, curate your list, and add custom titles to showcase
              product depth.
            </p>
          </div>
          <div className="app-controls__right">
            <button
              type="button"
              className="app-btn app-btn--solid"
              onClick={() => openAddMovieModal()}
            >
              Add Custom Title
            </button>
            {hiddenCount ? (
              <button
                type="button"
                className="app-btn app-btn--ghost"
                onClick={handleRestoreHidden}
              >
                Restore Hidden ({hiddenCount})
              </button>
            ) : null}
          </div>
        </section>

        <section className="genre-strip">
          {availableGenres.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`genre-chip ${selectedGenre === genre ? "genre-chip--active" : ""}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </section>

        {continueWatching.length && !showMyListOnly ? (
          <Category
            title="Continue Watching"
            subtitle="Titles you saved to your list"
            accent="var(--accent-cyan)"
            movies={continueWatching}
            onToggleFavorite={handleToggleFavorite}
            onToggleMyList={handleToggleMyList}
            onOpenDetails={(movie) => setSelectedMovieKey(movie.movieKey)}
            onEditMovie={openEditMovieModal}
            onDeleteMovie={handleDeleteMovie}
            onAddMovie={() => openAddMovieModal("trending")}
            showAddButton={false}
          />
        ) : null}

        {isLoading ? (
          <div className="loading-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`loading-${index}`} className="loading-row">
                <div className="loading-row__title" />
                <div className="loading-row__cards">
                  {Array.from({ length: 6 }).map((__, cardIndex) => (
                    <div key={`loading-card-${cardIndex}`} className="loading-card" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length ? (
          filteredCategories.map((category) => (
            <Category
              key={category.key}
              title={category.title}
              subtitle={category.subtitle}
              accent={category.accent}
              movies={category.movies}
              onToggleFavorite={handleToggleFavorite}
              onToggleMyList={handleToggleMyList}
              onOpenDetails={(movie) => setSelectedMovieKey(movie.movieKey)}
              onEditMovie={openEditMovieModal}
              onDeleteMovie={handleDeleteMovie}
              onAddMovie={() => openAddMovieModal(category.key)}
            />
          ))
        ) : (
          <section className="empty-state">
            <h3>No results match your current filters</h3>
            <p>Try clearing filters or switching genres to discover more titles.</p>
            <button type="button" className="app-btn app-btn--solid" onClick={clearFilters}>
              Clear Filters
            </button>
          </section>
        )}
      </main>

      <AddNewMovie
        isOpen={isFormOpen}
        mode={editingMovie ? "edit" : "add"}
        categories={CATEGORY_DEFINITIONS}
        defaultCategoryKey={defaultCategoryKey}
        initialMovie={editingMovie}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <EditMovieModal
        isOpen={Boolean(selectedMovie)}
        movie={selectedMovie}
        onClose={() => setSelectedMovieKey("")}
        onToggleFavorite={handleToggleFavorite}
        onToggleMyList={handleToggleMyList}
        onEditMovie={openEditMovieModal}
        onDeleteMovie={handleDeleteMovie}
      />

      {toastMessage ? <div className="toast">{toastMessage}</div> : null}
    </div>
  );
}

export default App;
