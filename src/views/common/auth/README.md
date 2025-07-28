# Permission System Documentation

This directory contains components and utilities for handling route-based permissions in the application.

## Components

### ProtectedRoute
A component that wraps routes and checks if the user has permission to access them.

**Usage:**
```jsx
import ProtectedRoute from "src/components/auth/ProtectedRoute";

<Route
  path="/users"
  element={
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### PermissionGuard
A component for conditionally rendering UI elements based on permissions.

**Usage:**
```jsx
import PermissionGuard from "src/components/auth/PermissionGuard";

<PermissionGuard permissionName="users" action="add">
  <Button>Add User</Button>
</PermissionGuard>
```

## Utilities

### Route Permissions (`src/utils/routePermissions.js`)

#### `checkRouteAccess(path, permissions)`
Checks if a user has access to a specific route based on their permissions.

#### `getAccessibleRoutes(permissions, userType)`
Returns an array of routes that the user can access.

#### `isPublicRoute(path)`
Checks if a route is public (doesn't require specific permissions).

#### `getRoutePermission(path, permissions)`
Gets the permission object for a specific route.

## Permission Structure

Based on your API response, permissions have the following structure:
```javascript
{
  permission_id: 10,
  permission_name: "Users",
  add: true,
  read: true,
  write: false,
  remove: false
}
```

## Route Mapping

The system maps routes to permissions using patterns:

- `/users` → "users" permission
- `/product` → "product" permission
- `/permission` → "permission" permission
- `/roles` → "roles" permission
- `/sub-admin` → "sub admin" permission
- `/dashboard` → "dashboard" permission
- `/terms-and-conditions` → "terms and conditions" permission
- `/privacy-policy` → "privacy policy" permission
- `/help-support` → "help support" permission

## Public Routes

The following routes are considered public and don't require specific permissions:
- `/401`
- `/404`
- `/`

## Usage Examples

### 1. Protecting Routes
```jsx
// In App.js or router configuration
<Route
  path="/users"
  element={
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### 2. Conditional UI Rendering
```jsx
// In a component
import PermissionGuard from "src/components/auth/PermissionGuard";

function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      
      <PermissionGuard permissionName="users" action="add">
        <Button>Add New User</Button>
      </PermissionGuard>
      
      <PermissionGuard permissionName="users" action="write">
        <Button>Edit User</Button>
      </PermissionGuard>
      
      <PermissionGuard permissionName="users" action="remove">
        <Button>Delete User</Button>
      </PermissionGuard>
    </div>
  );
}
```

### 3. Checking Permissions Programmatically
```jsx
import { useAuth } from "src/hooks/useAuth";
import { getRoutePermission } from "src/utils/routePermissions";

function MyComponent() {
  const { permissionsWithNames } = useAuth();
  const location = useLocation();
  
  const routePermission = getRoutePermission(location.pathname, permissionsWithNames);
  
  if (routePermission?.write) {
    // User can edit
  }
}
```

## Adding New Routes

To add a new protected route:

1. Add the route mapping in `src/utils/routePermissions.js`:
```javascript
export const ROUTE_PERMISSION_MAP = {
  // ... existing routes
  "/new-route": {
    pattern: "new permission",
    relatedRoutes: ["/new-route/:id"],
  },
};
```

2. Wrap the route with `ProtectedRoute` in your router:
```jsx
<Route
  path="/new-route"
  element={
    <ProtectedRoute>
      <NewRoutePage />
    </ProtectedRoute>
  }
/>
```

## User Types

- **admin**: Has access to all routes and permissions
- **sub_admin**: Has access based on assigned permissions
- Other user types: Follow the same permission-based access control 