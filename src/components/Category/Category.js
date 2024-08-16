import { useState, useEffect } from "react";
import axios from "axios";
import "./Category.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import AddNewMovie from "../AddNewMovie";
import EditMovieModal from "../EditMovieModal/EditMovieModal";

const baseUrl = "https://image.tmdb.org/t/p/original/";

const Category = ({ title, fetchUrl, isLargeCategory }) => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal visibility
  const [currentEditingMovie, setCurrentEditingMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results.map(movie => ({
        ...movie,
        isFavorite: false
      })));
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleFavorite = (movieId) => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === movieId) {
        return { ...movie, isFavorite: !movie.isFavorite };
      }
      return movie;
    }).sort((a, b) => b.isFavorite - a.isFavorite);
    setMovies(updatedMovies);
  };
  

  const handleDelete = (movieId) => {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    setMovies(updatedMovies); // Update the state
  };

  const handleEdit = (movieId) => {
    const movieToEdit = movies.find(movie => movie.id === movieId);
    if (movieToEdit) {
      setCurrentEditingMovie(movieToEdit);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = (updatedMovie) => {
    const updatedMovies = movies.map(movie => 
      movie.id === updatedMovie.id ? updatedMovie : movie
    );
    setMovies(updatedMovies);
    setEditModalVisible(false);
  };


   const addMovie = (movieDetails) => {
    const newMovie = {
      ...movieDetails,
      id: Date.now(), // or another unique identifier
      poster_path: movieDetails.imageUrl.startsWith("http") ? movieDetails.imageUrl : `${baseUrl}${movieDetails.imageUrl}`, // Correct the image URL
      isFavorite: false, // Set default favorite status
    };

    console.log('Adding new movie:', newMovie); // Check this log

    setMovies(prevMovies => [newMovie, ...prevMovies]);
    setShowModal(false);
  };
  
  const getImageUrl = (movie) => {
    if (movie.poster_path?.startsWith("http")) {
      return movie.poster_path;
    }
  
    return `${baseUrl}${isLargeCategory ? movie.poster_path : movie.backdrop_path}`;
  };


  return (
    <>
      <div className="Category">
        <div className="Category__header">
          <h2>{title}</h2>
          <button className="Category__addMovieBtn" onClick={() => setShowModal(true)}>
            Add Movie
          </button>
        </div>
        <div className="Category__posters">
          {movies.map((movie) => (
            <div key={movie.id} className="Category__posterContainer">
              <img
                className={`Category__poster ${isLargeCategory ? "Category__posterLarge" : ""}`}
                src={getImageUrl(movie)}
                alt={movie.title || movie.name}
              />
              <div className="Category__posterActions">
                <FontAwesomeIcon
                  icon={faStar}
                  className={`fa-icon star-icon ${movie.isFavorite ? "favorite" : ""}`}
                  onClick={() => handleFavorite(movie.id)}
                />
                <FontAwesomeIcon
                  icon={faEdit}
                  className="fa-icon"
                  onClick={() => handleEdit(movie.id)}
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="fa-icon"
                  onClick={() => handleDelete(movie.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddNewMovie 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={addMovie} 
        baseUrl={baseUrl}
      />
      {editModalVisible && (
        <EditMovieModal
          show={editModalVisible}
          movie={currentEditingMovie}
          onSave={handleSaveEdit}
          onClose={() => setEditModalVisible(false)}
        />
      )}
    </>
  );
  
};

export default Category;
