/**
 * Route Permission Utilities
 * Handles route-based permission checking and validation
 */

// Define route to permission mapping using patterns instead of exact names
export const ROUTE_PERMISSION_MAP = {
  "/users": {
    pattern: "users",
    relatedRoutes: ["/users/:id"],
  },
  "/product": {
    pattern: "product",
    relatedRoutes: ["/product/:id"],
  },
  "/category": {
    pattern: "category",
  },
  "/coupon": {
    pattern: "coupon",
  },
  "/cashout-fees": {
    pattern: "cashout fees",
  },
  "/cashout-requests": {
    pattern: "cashout requests",
  },
  "/permission": {
    pattern: "permission",
    relatedRoutes: [],
  },
  "/roles": {
    pattern: "roles",
    relatedRoutes: ["/roles/edit/:id", "/roles/add"],
  },
  "/sub-admin": {
    pattern: "sub admin",
    relatedRoutes: [],
  },

  "/terms-and-conditions": {
    pattern: "terms and conditions",
    relatedRoutes: [],
  },
  "/privacy-policy": {
    pattern: "privacy policy",
    relatedRoutes: [],
  },
  "/help-support": {
    pattern: "help support",
    relatedRoutes: [],
  },
  "/seller-agreement": {
    pattern: "seller agreement",
    relatedRoutes: [],
  },
  "/order-transactions": {
    pattern: "transaction",
    relatedRoutes: [],
  },
  "/wallet-transactions": {
    pattern: "transaction",
    relatedRoutes: [],
  },
};

export const PUBLIC_AUTHENTICATED_ROUTES = ["/401", "/404", "/", "/dashboard"];

/**
 * Check if user has access to the given route based on permissions
 * @param {string} path - Current route path
 * @param {Array} permissions - User permissions array
 * @returns {boolean} - Whether user has access
 */
export const checkRouteAccess = (path, permissions) => {
  // First check for exact route matches
  const basePath = Object.keys(ROUTE_PERMISSION_MAP).find(
    (route) => path === route || path.startsWith(route + "/")
  );

  if (basePath) {
    const routeConfig = ROUTE_PERMISSION_MAP[basePath];
    const requiredPattern = routeConfig.pattern.toLowerCase();

    // Find permission that matches the pattern
    const matchedPermission = permissions.find((permission) => {
      const permissionName = permission.permission_name?.toLowerCase();
      return permissionName && permissionName.includes(requiredPattern);
    });

    if (matchedPermission) {
      return matchedPermission.read === true;
    }
  }

  // If no exact match found, check for dynamic matches
  const pathForMatching = path
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/-/g, " ")
    .toLowerCase();

  // Find any permission that might match the path
  const matchedPermission = permissions.find((permission) => {
    const permissionName = permission.permission_name?.toLowerCase();
    return (
      permissionName &&
      (permissionName.includes(pathForMatching) ||
        pathForMatching.includes(permissionName))
    );
  });

  return matchedPermission?.read === true;
};

/**
 * Get accessible routes for a given set of permissions
 * @param {Array} permissions - User permissions array
 * @param {string} userType - Type of the user
 * @returns {array} - Array of accessible routes
 */
export const getAccessibleRoutes = (permissions, userType) => {
  // If user is admin, return all routes
  if (userType === "admin") {
    const allRoutes = [
      ...PUBLIC_AUTHENTICATED_ROUTES,
      ...Object.keys(ROUTE_PERMISSION_MAP),
    ];

    // Add all related routes
    Object.values(ROUTE_PERMISSION_MAP).forEach((config) => {
      allRoutes.push(...config.relatedRoutes);
    });

    return allRoutes;
  }

  if (!permissions || !Array.isArray(permissions)) {
    return PUBLIC_AUTHENTICATED_ROUTES;
  }

  const accessibleRoutes = [...PUBLIC_AUTHENTICATED_ROUTES];

  // Add routes based on permission patterns
  Object.entries(ROUTE_PERMISSION_MAP).forEach(([route, config]) => {
    const requiredPattern = config.pattern.toLowerCase();

    const matchedPermission = permissions.find((permission) => {
      const permissionName = permission.permission_name?.toLowerCase();
      return permissionName && permissionName.includes(requiredPattern);
    });

    if (matchedPermission?.read === true) {
      accessibleRoutes.push(route);
      // Add related routes
      accessibleRoutes.push(...config.relatedRoutes);
    }
  });

  return accessibleRoutes;
};

/**
 * Check if a route is public (doesn't require specific permissions)
 * @param {string} path - Route path to check
 * @returns {boolean} - Whether the route is public
 */
export const isPublicRoute = (path) => {
  return PUBLIC_AUTHENTICATED_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/")
  );
};

/**
 * Get permission for a specific route
 * @param {string} path - Route path
 * @param {Array} permissions - User permissions array
 * @returns {Object|null} - Permission object or null if not found
 */
export const getRoutePermission = (path, permissions) => {
  const basePath = Object.keys(ROUTE_PERMISSION_MAP).find(
    (route) => path === route || path.startsWith(route + "/")
  );

  if (basePath) {
    const routeConfig = ROUTE_PERMISSION_MAP[basePath];
    const requiredPattern = routeConfig.pattern.toLowerCase();

    return permissions.find((permission) => {
      const permissionName = permission.permission_name?.toLowerCase();
      return permissionName && permissionName.includes(requiredPattern);
    });
  }

  return null;
};
