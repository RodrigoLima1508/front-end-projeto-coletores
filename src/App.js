import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css'; // Importa o arquivo de estilos

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <button onClick={toggleTheme} style={themeToggleButtonStyle}>
          Alternar para {theme === 'light' ? 'Escuro' : 'Claro'}
        </button>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const themeToggleButtonStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  zIndex: 1000,
};

export default App;