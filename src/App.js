import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import './App.css';
import SearchBar from './searchBar';

function App() {
  return (
    <Router>
      <div className="App" style={{margin: 0, backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<SearchBar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;