

import logoImage from './logo.png';
import LandingPage from './LandingPage/LandingPage';
import React from 'react';
import SearchBar from "./searchBar.js";
import './App.css';


function App() {
  return (
    <div className="App" style={{margin: 0, backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LandingPage />
    </div>
    // <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //   <SearchBar />
    // </div>
  );
}

export default App;