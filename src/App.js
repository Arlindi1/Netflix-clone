import "./App.css";
import Category from "./components/Category/Category";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import requests from "./request";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Header />
      <Category
        title={"NETFLIX ORIGINALS"}
        fetchUrl={requests.fetchNetflixOriginals} isLargeCategory
        
      />
      <Category title={"Trending Now"} fetchUrl={requests.fetchTrending} isLargeCategory/>
      <Category title={"History Movies"} fetchUrl={requests.fetchHistoryMovies} isLargeCategory />
      <Category
        title={"Animation Movies"}
        fetchUrl={requests.fetchAnimationMovies} isLargeCategory
      />
      <Category title={"Fantasy Movies"} fetchUrl={requests.fetchFantasyMovies} isLargeCategory/>
      <Category title={"Romance Movies"} fetchUrl={requests.fetchRomanceMovies} isLargeCategory/>
    </div>
  );
}

export default App;
