import React, { useState, Suspense, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import "./App.css";
// eslint-disable-next-line
import AuthService from "@services/AuthService";
import ImportMusic from "./pages/SynMusic";
import EditProfile from "./pages/EditUserProfile";
import ArtistOverview from "./pages/ArtistOverview";
import UserContext from "./contexts/UserContext";
import MusicPlayerExtendedButtons from "./components/MusicPlayerExtendetButtons";
import Library from "./pages/Library";
import SearchResultGenre from "./pages/SearchResultGenre";
import SearchGenre from "./pages/SearchGenre";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserProfil from "./pages/UserProfil";
import Search from "./pages/Search";
import ProtectedRoute from "./components/Routing/ProtectedRoute";
import Home from "./pages/Home";
import themeGlobal from "./theme";
import Playlist from "./pages/Playlist";
import Settings from "./pages/Settings";
import WhenLoggedOut from "./components/Routing/WhenLoggedOut";
import WhenLoggedIn from "./components/Routing/WhenLoggedIn";
import Album from "./pages/Album";
import "./pages/theme.css";

function App() {
  // state for songQueue
  const [songQueue, setSongQueue] = useState([]);

  // This creates a variable representing the audio element. To connect the player with buttons (our own controls),
  // we can then call its methods, such as audioInstance.pause().
  // const [audioInstance, setAudioInstance] = useState(null);

  // state for changing responsive mode
  const [responsiveToggle, setResponsiveToggle] = useState(false);

  // state for custom shuffle button
  const [playModeOrder, setPlayModeOrder] = useState("order");

  // state for audio list aka "Warteschlange"
  const [audioListToggle, setAudioListToggle] = useState(true);
  // config options for the player (audioLists is current songQueue)
  const playerOptions = {
    audioLists: songQueue,
    quietUpdate: true,
    mode: "full",
    showDownload: false,
    theme: "dark",
    showThemeSwitch: false,
    showReload: false,
    responsive: responsiveToggle,
    playMode: playModeOrder,
    showPlayMode: false,
    toggleMode: false,
    glassBg: false,
    // TO DO: SPACEBAR-OPTION NOT WORKING PROBABLY
    spaceBar: true,
    showMediaSession: true,
    autoHiddenCover: false,
    mobileMediaQuery:
      "(max-width: 1000000px) and (orientation: landscape), (max-width: 1000000px) and (orientation: portrait)",
    clearPriorAudioLists: audioListToggle,
    remember: true,
    extendsContent: (
      <MusicPlayerExtendedButtons
        playModeOrder={playModeOrder}
        setPlayModeOrder={setPlayModeOrder}
      />
    ),
    onAudioListsChange() {
      // this throws an exception and crashes the function but it somehow fixes the problem that not all tracks are playable...
      // eslint-disable-next-line
      if (this.clearPriorAudioLists) return Promise.reject();

      return true;
    },
    onCoverClick() {
      console.warn(`responsive: ${responsiveToggle}`);
      setResponsiveToggle(!responsiveToggle);
    },

    // TO DO: CHECK IF LINES BELOW ARE NECCESSARY OR COULD BE DELETED
    // getAudioInstance(instance) {
    //   setAudioInstance(instance);
    // },
  };

  const [user, setUser] = useState(false);
  function authChanged(u) {
    setUser(u);
  }

  const [auth, setAuth] = useState(null);

  // const auth = new AuthService(authEvent);
  useEffect(async () => {
    setAuth(new AuthService(authChanged));
  }, []);

  useEffect(async () => {
    if (auth) setUser(await auth.getCurrentUser());
  }, [auth]);

  const userAuthMemo = useMemo(() => {
    return { auth, user };
  }, [auth, user]);

  return (
    <Router>
      <Suspense fallback="loading">
        <ThemeProvider theme={themeGlobal}>
          <CssBaseline />

          <div className="App">
            {user === false ? null : (
              <UserContext.Provider value={userAuthMemo}>
                <Routes>
                  {/* In this route do not show the sitenav and musicplayer */}
                  <Route element={<WhenLoggedOut />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                  </Route>
                  {/* In this route show the sitenav and musicplayer */}
                  <Route
                    element={<WhenLoggedIn playerOptions={playerOptions} />}
                  >
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <Search
                            songQueue={songQueue}
                            setSongQueue={setSongQueue}
                            setAudioListToggle={setAudioListToggle}
                          />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      excat
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <UserProfil />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      excat
                      path="/editprofile"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      excat
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      excat
                      path="/importmusic"
                      element={
                        <ProtectedRoute>
                          <ImportMusic />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search-genre"
                      element={
                        <ProtectedRoute>
                          <SearchGenre />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search-result-genre"
                      element={
                        <ProtectedRoute>
                          <SearchResultGenre />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/library"
                      element={
                        <ProtectedRoute>
                          <Library />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/playlists/:playlistId"
                      element={
                        <ProtectedRoute>
                          <Playlist
                            setAudioListToggle={setAudioListToggle}
                            setSongQueue={setSongQueue}
                          />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/albums/:albumId"
                      element={
                        <ProtectedRoute>
                          <Album
                            setSongQueue={setSongQueue}
                            setAudioListToggle={setAudioListToggle}
                          />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/artists/:artistId"
                      element={
                        <ProtectedRoute>
                          <ArtistOverview
                            setSongQueue={setSongQueue}
                            setAudioListToggle={setAudioListToggle}
                          />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </UserContext.Provider>
            )}
          </div>
        </ThemeProvider>
      </Suspense>
    </Router>
  );
}

export default App;
