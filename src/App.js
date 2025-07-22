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
// import UserDetailPage from "./pages/users/details";
// import Clientspage from "./pages/clients/index";

const HomePage = React.lazy(() => import("./pages/home"));
const DashBoardPage = React.lazy(() => import("./pages/dashboard"));
const LoginPage = React.lazy(() => import("./pages/login"));
const ForgotPassword = React.lazy(() => import("./pages/login/forgotpassword"));
const BanerPage = React.lazy(() => import("./pages/banner"));
const Page401 = React.lazy(() => import("./pages/401"));
const Page404 = React.lazy(() => import("./pages/404"));

const Permission = React.lazy(() =>
  import("./pages/RoleManagement/Permissions")
);
// const Legalcontent = React.lazy(() => import("./pages/legal_content"));
const TermsandConditionPage = React.lazy(() =>
  import("./pages/terms-and-condition")
);
const PrivacyPolicyPage = React.lazy(() => import("./pages/privacy_policy"));
const HelpSupporPage = React.lazy(() => import("./pages/help_support"));
const UsersPage = React.lazy(() => import("./pages/users"));
const ProductPage = React.lazy(() => import("./pages/product"));
const ProductDetailPage = React.lazy(() =>
  import("./pages/product/ProductDetailPage")
);
const SubAdminPage = React.lazy(() =>
  import("./pages/RoleManagement/SubAdmin")
);
const RolesPage = React.lazy(() => import("./pages/RoleManagement/Roles"));
// const UserDetailPage = React.lazy(() => import('./pages/users/userDetail'))
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
              <Route path="/banner" element={<BanerPage />} />
              {/* <Route path="/legalcontent" element={<Legalcontent />} /> */}
              <Route
                path="/terms-and-conditions"
                element={<TermsandConditionPage />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/help-support" element={<HelpSupporPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/permission" element={<Permission />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/roles/edit/:id" element={<AddEditRolePage />} />
              <Route path="/roles/add" element={<AddEditRolePage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
              <Route path="/sub-admin" element={<SubAdminPage />} />
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
