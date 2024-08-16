const API_KEY = "20be784f740b6b638c906dde5b35efae";

const requests = {
  fetchFantasyMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=14`,
  fetchTrending: `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`,
  fetchNetflixOriginals: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=1&timezone=%20Europe%2FIstanbul&with_networks=213`,
  fetchHistoryMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=36`,
  fetchAnimationMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16`,
  fetchTopRated: `https://api.themoviedb.org/3movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  fetchRomanceMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`,
};
export default requests;
