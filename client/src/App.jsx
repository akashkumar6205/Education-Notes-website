import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';

const App = () => {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    // Attempt auto-login if token is preserved in localStorage
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans antialiased">
        <Routes>
          {/* Main Landing / Selector View */}
          <Route path="/" element={<Home />} />

          {/* Educational Notes Repository */}
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteDetail />} />

          {/* Administrative Portal */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;