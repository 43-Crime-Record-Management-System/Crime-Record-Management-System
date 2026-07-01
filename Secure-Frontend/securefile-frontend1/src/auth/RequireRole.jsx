import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  const normalizedRole = user.role.replace("ROLE_", "");

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
