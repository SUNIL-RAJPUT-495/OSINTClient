import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "./pages/landingPage";
import { AuthPage } from './pages/AuthPage';
import { RoomsPage } from './pages/RoomsPage';
import { ProtectedRoute } from './component/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute> <RoomsPage /></ProtectedRoute>

        }
      />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;