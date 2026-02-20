import { useEffect, useState } from "react";
import "./Navbar.css";

const NAV_LINKS = ["Home", "Series", "Movies", "New & Popular"];

const Navbar = ({
  searchQuery,
  onSearchChange,
  favoriteCount,
  myListCount,
  showMyListOnly,
  onToggleMyList,
  onClearFilters,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`nav ${isScrolled ? "nav--solid" : ""}`}>
      <div className="nav__left">
        <img className="nav__logo" src="/netflix-logo.png" alt="Netflix logo" />
        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button key={link} type="button" className="nav__link">
              {link}
            </button>
          ))}
        </nav>
      </div>

      <div className="nav__right">
        <label className="nav__search">
          <span className="sr-only">Search movies and series</span>
          <input
            type="text"
            placeholder="Search titles, genres, keywords..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <button type="button" className="nav__pill" onClick={onToggleMyList}>
          {showMyListOnly ? "Showing My List" : `My List (${myListCount})`}
        </button>
        <span className="nav__meta">Favorites: {favoriteCount}</span>
        <button type="button" className="nav__clear" onClick={onClearFilters}>
          Reset
        </button>
        <img className="nav__avatar" src="/Netflix-avatar.png" alt="Profile avatar" />
      </div>
    </header>
  );
};

export default Navbar;
