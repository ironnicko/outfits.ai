import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import CreateAccount from './components/CreateAccount';
import Navbar from './components/Navbar';
import ClosetView from "./components/ClosetView"

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/home" element={<LandingPage />} />
          <Route
            path="/closet"
            element={
              <ProtectedRoute>
                <ClosetView />
              </ProtectedRoute>
            }
          />
          {/* Default route */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
