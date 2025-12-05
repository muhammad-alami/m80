import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SummaryPage from './pages/SummaryPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const location = useLocation();
  const hideNavOnLogin = location.pathname === '/login';

  return (
    <div className="app">
      {!hideNavOnLogin && <TopNav />}

      <main role="main">
        <Routes>
          {/* default route -> go to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <SummaryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* any unknown path also goes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
