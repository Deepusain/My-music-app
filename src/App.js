import "./App.css";
import { useContext, useEffect, useState } from "react";
import Card from "./components/Card";
import CreatePlaylist from "./components/CreatePlaylist";
import { initializePlaylist } from "./initialize";
import Navbar from "./components/Navbar";
import { MusicContext } from "./Context";

function App() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);

  const musicContext = useContext(MusicContext);
  const isLoading = musicContext.isLoading;
  const setIsLoading = musicContext.setIsLoading;
  const setLikedMusic = musicContext.setLikedMusic;
  const setpinnedMusic = musicContext.setPinnedMusic;
  const resultOffset = musicContext.resultOffset;
  const setResultOffset = musicContext.setResultOffset;

  const fetchMusicData = async () => {
    setTracks([]);
    window.scrollTo(0, 0);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${keyword}&type=track&offset=${resultOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch music data");
      }

      const jsonData = await response.json();

      setTracks(jsonData.tracks.items);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultOffset(0);
      fetchMusicData();
    }
  };

  useEffect(() => {
    initializePlaylist();

    // current client credentials will be deleted in few days
    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")));
    setpinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")));
  }, [setIsLoading, setLikedMusic, setpinnedMusic]);

  return (
    <>
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={fetchMusicData}
      />

      <div className="container">
        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div className="row">
          {tracks.map((element) => {
            return <Card key={element.id} element={element} />;
          })}
        </div>
        <div className="row" hidden={tracks.length === 0}>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous - 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
              disabled={resultOffset === 0}
            >
              Previous Next Page: {resultOffset / 20}
            </button>
          </div>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous + 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
            >
              Next Page: {resultOffset / 20 + 2}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="text-center text-danger py-2">{message}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12 py-5 text-center">
            <h1>
              <i className="bi bi-music-note-list mx-3"></i>
              My-music
            </h1>
            <h3 className="py-5">Discover music in 30 seconds</h3>
            <div>
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-dark"
                href="https://github.com/Deepusain/MY-music/upload/main"
              >
                <i className="bi bi-github mx-2"></i>Deepak Github  
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade position-absolute"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <CreatePlaylist />
      </div>
    </>
  );
}
// import './App.css';
// import { useState } from 'react';

// function App() {
//   const [keyword, setKeyword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [tracks , setTracks] = useState([]);

//   const getTracks = async()=>{
//     setIsLoading(true);
//     let data =await fetch(
//       `https://v1.nocodeapi.com/deeepak_nai/spotify/iGYOYuqPMMGZkrFn/search?q=${keyword ==="" ? "trending" :keyword }&type=track`
//     );
//     let convertedData = await data.json();
//     console.log(convertedData.tracks.items);
//     setTracks(convertedData.tracks.items);
//     setIsLoading(false);
//   }; 

//   return (
//   <> 
//   <nav className="navbar navbar-dark  navbar-expand-lg bg-dark">
//   <div className="container-fluid">
//     <a className="navbar-brand" href="#">
//       My-music
//     </a>
//     <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
//     <input
//         value={keyword}
//         onChange={(event) => setKeyword(event.target.value)}
//           className="form-control me-2 w-75"
//           type="search"
//           placeholder="Search"
//           aria-label="Search"
//         />
//         <button onClick={getTracks} className="btn btn-outline-success" >
//           Search
//         </button>
//     </div>
//   </div>
//   </nav>
//   <div className="container">
//     <div className={`row ${isLoading ? "" : "d-none"}`}>
//       <div className="col-12 py-5 text-center">
//         <div
//           className="spinner-border"
//           style={{ width: "3rem", height: "3rem" }}
//           role="status">
//           <span className="visually-hidden">Loading...</span>
//          </div>
//       </div>
//     </div>
//     <div className={`row ${keyword ==="" ? "" : "d-none"}`}>
//       <div className="col-12 py-5 text-center">
//         <h1>My-music</h1>
//       </div>
//     </div>
//     <div className="row">
//       {tracks.map((element) =>{
//           return (
//             <div key={element.id} className="col-lg-3 col-md-6 py-2">
//               <div className="card"> 
//                 <img src={element.album.images[0].url} className="card-img-top" alt="..." />
//                 <div className="card-body">
//                   <h5 className="card-title">{element.name}</h5>
//                   <p className="card-text">
//                     Artish: {element.album.artists[0].name}
//                   </p>
//                   <p className="card-text">
//                     Release date: {element.album.release_date}
//                   </p>
//                   <audio src={element.preview_url} controls className="w-100"></audio>
//                 </div>
//               </div>

//             </div>
//           )
//         })
//       }
//     </div>
//   </div>
//   </>
//   );
// }

export default App;
