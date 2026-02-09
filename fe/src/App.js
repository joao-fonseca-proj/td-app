import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { getUserInformation } from './services/AuthenticationService';

// --- PROTECTION HELPERS ---

// Helper to check if user is authenticated
const isAuthenticated = () => {
  const user = getUserInformation();
  return user !== null && user.token !== '';
};

// 1. ProtectedRoute: Wraps pages that require login
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// 2. PublicRoute: Wraps pages that should NOT be seen if logged in (like Login)
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect base to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route: Only for guests */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected Route: Only for logged-in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Redirect to login or dashboard based on auth */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}