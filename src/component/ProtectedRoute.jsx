import { Navigate, useLocation } from 'react-router-dom';

// --- USER PROTECTED ROUTE ---


export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  if (!token || token === "undefined" || token === "null" || token === "") {
    localStorage.removeItem('access_token');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

// --- ADMIN PROTECTED ROUTE ---


export const ProtectedRouteAdmin = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const userRawData = localStorage.getItem('user_data');

  if (!token || token === "undefined" || token === "null" || token === "") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const userData = JSON.parse(userRawData);
    
    if (userData?.role !== 'admin') {
      console.log("Access Denied: Not an Admin");
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};