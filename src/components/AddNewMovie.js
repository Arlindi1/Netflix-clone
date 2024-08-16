import React, { useState } from 'react';
import "./AddNewMovie.css"; // Make sure to create an AddNewMovie.css file for styling



function AddNewMovie({ show, onClose, onAdd, baseUrl }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  
  if (!show) {
    return null;
  }

  const handleSubmit = () => {
    if (!title || !imageUrl) {
      alert("Title and Image URL are required.");
      return;
    }
    console.log("Adding movie with details:", { title, description, imageUrl }); // Log the details for debugging
    onAdd({
      // No need for an ID here if you're generating it in the Category component
      title,
      description,
      imageUrl: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`, 
      isFavorite: false
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>Add New Movie</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button onClick={handleSubmit}>Add Movie</button>
      </div>
    </div>
  );
}


export default AddNewMovie;
