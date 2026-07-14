import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import OfflineScreen from './components/OfflineScreen';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  const { user } = useSelector(state => state.auth);

  return (
    <Router>
      <OfflineScreen /> {/* Shows full-screen overlay when connection drops */}
      <Navbar /> {/* Now Navbar appears on every page for logged-in users */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Module...</div>}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/video/:id" element={user ? <VideoDetail /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;