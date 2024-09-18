import React from 'react';
import './App.css';
import SearchBar from './searchBar';

function App() {
  return (
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SearchBar />
    </div>
  );
}

export default App;