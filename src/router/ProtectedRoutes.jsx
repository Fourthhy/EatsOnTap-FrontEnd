import { Navigate } from "react-router-dom";
import { getAuthData } from "../utils/authChecker";

export default function ProtectedRoute({ children, allowedRoles }) {
    const auth = getAuthData();

    if (!auth) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        console.error(`⛔ Access Denied: Role ${auth.role} is not authorized.`);
        return <Navigate to="/" replace />;
    }

    return children;
}