// EditMovieModal.js
import React from 'react';
import './EditMovieModal.css'; // This is assuming you have a common CSS file for modals

const EditMovieModal = ({ show, movie, onSave, onClose }) => {
  const [editedMovie, setEditedMovie] = React.useState(movie);

  React.useEffect(() => {
    setEditedMovie(movie); // This ensures that the modal receives the latest movie data
  }, [movie]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    setEditedMovie({ ...editedMovie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedMovie);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={editedMovie.title} onChange={handleChange} />
          </label>
          {/* Add other fields as needed, make sure they match the ones in AddMovie modal */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;
