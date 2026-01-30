import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "./pages/landingPage";
import { AuthPage } from './pages/AuthPage';
import { RoomsPage } from './pages/RoomsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { RoomDetail } from './component/admin/RoomDetail';
import { AdminLogin } from './pages/AdminLogin';

import { ProtectedRoute } from './component/ProtectedRoute';
import { ProtectedRouteAdmin } from './component/ProtectedRoute';

import { ChallengeView } from './component/challenges';
import { ChallengeSuccess } from './component/ChallengeSuccess';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
             <RoomsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/room/:id"
        element={
          <ProtectedRoute>
             <RoomDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challange/:id"
        element={
          <ProtectedRoute>
             <ChallengeView/>
          </ProtectedRoute>
        }
      />
      <Route path='/challaneSuccess' element={ <ProtectedRoute><ChallengeSuccess  /></ProtectedRoute>} />

      <Route 
        path="/admin" 
        element={
          <ProtectedRouteAdmin>
             <AdminDashboard />
          </ProtectedRouteAdmin>
        } 
      />
      
    </Routes>
  );
}

export default App;