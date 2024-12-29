import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/main/LoginForm';
import Dashboard from './components/pages/Dashboard';
import Maintenance from './components/maintenance/Maintenance';
import Home from './components/pages/Home';
import NewSiswa from './components/newSiswa/New';
import ChangePassword from './components/main/ForgotPassword';

// Komponen untuk melindungi rute privat
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [userLogin, setUserLogin] = useState(false); // State untuk status login

  const handleLogin = () => setUserLogin(true); // Set login state ke true
  const handleLogout = () => setUserLogin(false); // Set login state ke false

  return (
      <div className="w-screen h-screen bg-slate-300 print:bg-white">
        <Routes>
          {/* Route Login */}
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />

          {/* Route Dashboard */}
          <Route
            path="/Dashboard"
            element={
              <PrivateRoute isAuthenticated={userLogin}>
                <Dashboard onLogout={handleLogout} />
              </PrivateRoute>
            }
          />

          {/* Route Kelola Data Siswa */}
          <Route
            path="/Homes"
            element={
              <PrivateRoute isAuthenticated={userLogin}>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Route untuk Siswa Baru */}
          <Route
            path="/newsiswa"
            element={
              <PrivateRoute isAuthenticated={userLogin}>
                <NewSiswa />
              </PrivateRoute>
            }
          />

          {/* Route Laporan */}
          <Route
            path="/maintenance"
            element={<Maintenance />}
          />

          {/* Route Ubah Password */}
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/ForgotPw" element={<ChangePassword />} />

          {/* Redirect Root */}
          <Route
            path="/"
            element={
              userLogin ? <Navigate to="/Dashboard" /> : <Navigate to="/login" />
            }
          />

          {/* Default Route (404) */}
          <Route
            path="*"
            element={<div className="text-center">404 - Page Not Found</div>}
          />
        </Routes>
      </div>
  );
};

export default App;
