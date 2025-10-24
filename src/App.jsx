import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Home />
      </div>
    </AuthProvider>
  );
}

export default App;