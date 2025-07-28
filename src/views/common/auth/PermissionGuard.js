import React from "react";
import { useAuth } from "src/hooks/useAuth";

/**
 * PermissionGuard component for conditional rendering based on permissions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render if permission is granted
 * @param {string} props.permissionName - Permission name to check
 * @param {string} props.action - Action to check (read, write, add, remove)
 * @param {React.ReactNode} props.fallback - Fallback component to render if permission is denied
 * @returns {React.ReactNode} - Rendered component or fallback
 */
const PermissionGuard = ({
  children,
  permissionName,
  action = "read",
  fallback = null,
}) => {
  const { user, userType, permissionsWithNames } = useAuth();

  // If user is admin, always allow
  if (userType === "admin") {
    return children;
  }

  // If no user, don't render anything
  if (!user) {
    return fallback;
  }

  // Find the permission
  const permission = permissionsWithNames?.find((perm) => {
    const permName = perm.permission_name?.toLowerCase();
    return permName && permName.includes(permissionName.toLowerCase());
  });

  // Check if user has the required permission
  const hasPermission = permission && permission[action] === true;

  return hasPermission ? children : fallback;
};

export default PermissionGuard;
