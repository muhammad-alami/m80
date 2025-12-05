import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If there is no token, send the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the protected page
  return children;
}

export default ProtectedRoute;
