import React, { Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import FallbackSpinner from "./@core/components/spinner";

import AuthGuard from "src/@core/components/auth/AuthGuard";
import UserLayout from "./layouts/UserLayout";
import BlankLayout from "./@core/layouts/BlankLayout";
// import BlankLayoutWithAppBar from './@core/layouts/BlankLayoutWithAppBar'
import AclGuard from "./@core/components/auth/AclGuard";
import GuestGuard from "./@core/components/auth/GuestGuard";
import { defaultACLObj } from "./configs/acl";
import AuthLayout from "./layouts/AuthLayout";
import AddEditRolePage from "./pages/RoleManagement/Roles/AddEditRole";
import ProtectedRoute from "./views/common/auth/ProtectedRoute";

const HomePage = React.lazy(() => import("./pages/home"));
const DashBoardPage = React.lazy(() => import("./pages/dashboard"));
const LoginPage = React.lazy(() => import("./pages/login"));
const ForgotPassword = React.lazy(() => import("./pages/login/forgotpassword"));
const Page401 = React.lazy(() => import("./pages/401"));
const Page404 = React.lazy(() => import("./pages/404"));

const Permission = React.lazy(() =>
  import("./pages/RoleManagement/Permissions")
);
const TermsAndConditionPage = React.lazy(() =>
  import("./pages/website/terms-and-condition")
);
const PrivacyPolicyPage = React.lazy(() =>
  import("./pages/website/privacy-policy")
);
const HelpSupporPage = React.lazy(() => import("./pages/website/help-support"));
const UsersPage = React.lazy(() => import("./pages/users"));
const ProductPage = React.lazy(() => import("./pages/product"));
const ProductDetailPage = React.lazy(() =>
  import("./pages/product/ProductDetailPage")
);
const SubAdminPage = React.lazy(() =>
  import("./pages/RoleManagement/SubAdmin")
);
const RolesPage = React.lazy(() => import("./pages/RoleManagement/Roles"));
const UserDetailPage = React.lazy(() => import("./pages/users/details"));

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>;
  }
};

function App() {
  const aclAbilities = defaultACLObj;

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <AclGuard aclAbilities={aclAbilities}>
        <Routes>
          <Route
            element={
              <BlankLayout>
                <Outlet />
              </BlankLayout>
            }
          >
            <Route path="/401" element={<Page401 />} />
            <Route path="/404" element={<Page404 />} />

            <Route
              element={
                <AuthLayout>
                  <Outlet />
                </AuthLayout>
              }
            >
              <Route
                element={
                  <Guard guestGuard>
                    <Outlet />
                  </Guard>
                }
              >
                <Route path="/login" element={<LoginPage />}></Route>
                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                ></Route>
              </Route>
            </Route>
          </Route>

          <Route
            element={
              <UserLayout>
                <Outlet />
              </UserLayout>
            }
          >
            <Route
              element={
                <Guard authGuard>
                  <Outlet />
                </Guard>
              }
            >
              <Route path="" element={<HomePage />} />
              <Route path="/dashboard" element={<DashBoardPage />} />
              <Route
                path="/terms-and-conditions"
                element={
                  <ProtectedRoute>
                    <TermsAndConditionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <ProtectedRoute>
                    <PrivacyPolicyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help-support"
                element={
                  <ProtectedRoute>
                    <HelpSupporPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product"
                element={
                  <ProtectedRoute>
                    <ProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/permission"
                element={
                  <ProtectedRoute>
                    <Permission />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute>
                    <RolesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles/edit/:id"
                element={
                  <ProtectedRoute>
                    <AddEditRolePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles/add"
                element={
                  <ProtectedRoute>
                    <AddEditRolePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute>
                    <UserDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sub-admin"
                element={
                  <ProtectedRoute>
                    <SubAdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* If no route found redirect it to --> /404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AclGuard>
    </Suspense>
  );
}

export default App;
