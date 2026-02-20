const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "20be784f740b6b638c906dde5b35efae";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export const GENRE_LOOKUP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const requests = {
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTrending: `/trending/all/week?api_key=${API_KEY}`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  fetchHistoryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=36`,
  fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
  fetchFantasyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=14`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchSciFi: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
};

export const CATEGORY_DEFINITIONS = [
  {
    key: "netflixOriginals",
    title: "Netflix Originals",
    subtitle: "Flagship shows that define the platform",
    fetchUrl: requests.fetchNetflixOriginals,
    accent: "var(--accent-red)",
  },
  {
    key: "trending",
    title: "Trending Now",
    subtitle: "Hot this week across movies and series",
    fetchUrl: requests.fetchTrending,
    accent: "var(--accent-cyan)",
  },
  {
    key: "topRated",
    title: "Top Rated",
    subtitle: "Critically acclaimed titles",
    fetchUrl: requests.fetchTopRated,
    accent: "var(--accent-gold)",
  },
  {
    key: "history",
    title: "History Epics",
    subtitle: "Period stories and world-changing moments",
    fetchUrl: requests.fetchHistoryMovies,
    accent: "var(--accent-amber)",
  },
  {
    key: "animation",
    title: "Animation",
    subtitle: "Stylized adventures for every age",
    fetchUrl: requests.fetchAnimationMovies,
    accent: "var(--accent-lime)",
  },
  {
    key: "fantasy",
    title: "Fantasy Worlds",
    subtitle: "Magic, legends, and impossible realms",
    fetchUrl: requests.fetchFantasyMovies,
    accent: "var(--accent-violet)",
  },
  {
    key: "romance",
    title: "Romance",
    subtitle: "Big emotions and unforgettable chemistry",
    fetchUrl: requests.fetchRomanceMovies,
    accent: "var(--accent-rose)",
  },
  {
    key: "documentaries",
    title: "Documentaries",
    subtitle: "Stories grounded in real life",
    fetchUrl: requests.fetchDocumentaries,
    accent: "var(--accent-emerald)",
  },
  {
    key: "scifi",
    title: "Sci-Fi Futures",
    subtitle: "Distant worlds and emerging tech",
    fetchUrl: requests.fetchSciFi,
    accent: "var(--accent-indigo)",
  },
];

export default requests;
