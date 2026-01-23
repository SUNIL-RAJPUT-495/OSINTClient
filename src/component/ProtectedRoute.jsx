import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

 

  if (!token || token === "undefined" || token === "null" || token === "") {
  
    localStorage.removeItem('access_token');
   
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};