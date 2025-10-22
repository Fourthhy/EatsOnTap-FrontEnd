import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authChecker";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Not authenticated, redirect to login page
    return <Navigate to="/" replace />;
  }
  return children;
}
