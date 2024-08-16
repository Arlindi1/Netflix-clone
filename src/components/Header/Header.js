import "./Header.css";
import { useState, useEffect } from "react";
import axios from "axios";
import requests from "../../request";

const Header = () => {
  const [movie, setMovie] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  return (
    <header
      className="Header"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(" https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "50% 10%",
      }}
    >
      <div className="Header__contents">
        <h1 className="Header__title">
          {movie?.title || movie.name || movie?.original_name}
        </h1>
        <div className="Header__buttons">
          <button className="Header__button">Play</button>
          <button className="Header__button">My List</button>
        </div>
        <h1 className="Header__description">{movie?.overview}</h1>
      </div>
      <div className="Header__fadeBottom" />
    </header>
  );
};

export default Header;
