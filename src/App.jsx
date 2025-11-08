import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Subastas from './pages/Subastas';
import Artistas from './pages/Artistas';
import Acerca from './pages/Acerca';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subastas" element={<Subastas />} />
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/acerca" element={<Acerca />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
