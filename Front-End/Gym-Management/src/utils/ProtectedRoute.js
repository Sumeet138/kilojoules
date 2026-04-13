import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRole }) {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/dashboard/${userRole}/home`} replace />;
  }

  return children;
}

export default ProtectedRoute;
