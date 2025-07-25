/**
 * Permissions Utility Functions
 * Handles permission mapping and navigation filtering based on user roles
 */

/**
 * Maps role permissions with permission names from permission list
 * @param {Array} rolePermissions - Array of role permissions from login response
 * @param {Array} permissionList - Array of all available permissions
 * @returns {Array} Array of role permissions with permission names added
 */
export const getPermissionNames = (rolePermissions, permissionList) => {
  if (!Array.isArray(rolePermissions) || !Array.isArray(permissionList))
    return [];

  // Get all permission_ids from rolePermissions
  const rolePermissionIds = rolePermissions.map((p) => p.permission_id ?? p.id);

  // Filter permissionList to only include items whose id matches rolePermissionIds
  return permissionList
    .filter((permission) => {
      const permissionId = permission.permission_id ?? permission.id;
      return rolePermissionIds.includes(permissionId);
    })
    .map((permission) => {
      // Find the matching role permission
      const matchingRolePermission = rolePermissions.find(
        (rolePerm) => (rolePerm.permission_id ?? rolePerm.id) === (permission.permission_id ?? permission.id)
      );

      // Return the role permission with permission name added
      return {
        ...matchingRolePermission,
        permission_name: permission.name ?? permission.permission_name
      };
    });
};

/**
 * Filters navigation items based on user permissions
 * @param {Array} navItems - Array of navigation items to filter
 * @param {string} userType - User type (admin, staff, etc.)
 * @param {Array} permissionsWithNames - Array of permissions with names from getPermissionNames
 * @returns {Array} Filtered navigation items
 */
export const getAccessibleNavItems = (
  navItems,
  userType,
  permissionsWithNames
) => {
  if (userType === "admin") {
    return navItems;
  }

  return navItems
    .map((item) => {
      // Find the matching permission using 'name' or 'permission_name'
      const matchedPermission = permissionsWithNames?.find((perm) => {
        // Handle both formats: permission_name/name and permission_id/id
        const permName = perm.permission_name ?? perm.name;
        const permId = perm.permission_id ?? perm.id;
        
        // Check if permission name matches item title
        const nameMatches = permName?.toLowerCase().includes(item.title?.toLowerCase());
        
        // Also check if permission_id matches (for cases where title might not match exactly)
        const idMatches = permId && item.permission_id && permId === item.permission_id;
        
        return nameMatches || idMatches;
      });

      const updatedItem = { ...item };

      // Add permission_id (fallback to id) if matched
      if (matchedPermission) {
        updatedItem.permission_id =
          matchedPermission.permission_id ?? matchedPermission.id;
      }

      // Recursively check children
      if (item.children) {
        updatedItem.children = getAccessibleNavItems(
          item.children,
          userType,
          permissionsWithNames
        );
      }

      // Always keep dashboard
      if (item.title === "Dashboard") {
        return updatedItem;
      }

      const hasReadPermission = matchedPermission?.read;
      const hasAccessibleChildren =
        updatedItem.children && updatedItem.children.length > 0;

      if (hasReadPermission || hasAccessibleChildren) {
        return updatedItem;
      }

      return null;
    })
    .filter(Boolean);
};

/**
 * Checks if user has specific permission for a given action
 * @param {Array} rolePermissions - Array of role permissions with permission names
 * @param {string} permissionName - Name of the permission to check
 * @param {string} action - Action to check (read, write, add, remove)
 * @returns {boolean} True if user has permission, false otherwise
 */
export const hasPermission = (rolePermissions, permissionName, action) => {
  const permission = rolePermissions?.find(
    (perm) =>
      perm.permission_name &&
      perm.permission_name?.toLowerCase().includes(permissionName?.toLowerCase())
  );

  return permission ? permission[action] : false;
};

/**
 * Gets all permissions for a specific permission name
 * @param {Array} rolePermissions - Array of role permissions with permission names
 * @param {string} permissionName - Name of the permission to get
 * @returns {Object|null} Permission object or null if not found
 */
export const getPermissionByName = (rolePermissions, permissionName) => {
  return (
    rolePermissions?.find(
      (perm) =>
        perm.permission_name &&
        perm.permission_name?.toLowerCase().includes(permissionName?.toLowerCase())
    ) || null
  );
};
