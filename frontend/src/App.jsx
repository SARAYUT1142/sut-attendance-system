import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import SectionPage from './pages/SectionPage';
import SessionDetailPage from './pages/SessionDetailPage';
import StudentCheckinPage from './pages/StudentCheckinPage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // --- API Utility ---
  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(newUser);
  };

  return (
    <div className="font-sans antialiased text-slate-800 selection:bg-indigo-100">
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginView token={token} onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterView token={token} />} />
        <Route path="/dashboard" element={token ? <DashboardPage token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/courses/:courseId" element={token ? <CoursePage token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/courses/:courseId/sections/:sectionId" element={token ? <SectionPage token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/courses/:courseId/sections/:sectionId/sessions/:sessionId" element={token ? <SessionDetailPage token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/courses/:courseId/sections/:sectionId/sessions/:sessionId/checkin" element={<StudentCheckinPage token={token} />} />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
};

export default App;