import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { 
  checkRouteAccess, 
  isPublicRoute,
  getAccessibleRoutes
} from "src/utils/routePermissions";
import FallbackSpinner from "src/@core/components/spinner";

const ProtectedRoute = ({ children }) => {
  const { user, userType, permissionsWithNames, loading, permissionsLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth or permissions are being loaded
  if (loading || permissionsLoading) {
    return <FallbackSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = location.pathname;
  
  // Check if it's a public authenticated route
  if (isPublicRoute(currentPath)) {
    return children;
  }

  // If user is admin, allow access to all routes
  if (userType === "admin") {
    return children;
  }

  // Get user permissions from the context
  const userPermissions = permissionsWithNames || [];

  // Check if user has access to the current route
  const hasRouteAccess = checkRouteAccess(currentPath, userPermissions);

  if (!hasRouteAccess) {
    return <Navigate to="/401" replace />;
  }

  return children;
};

export { getAccessibleRoutes };
export default ProtectedRoute; 