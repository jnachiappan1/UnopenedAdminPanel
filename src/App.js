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
// import Clientspage from "./pages/clients/index";


const HomePage = React.lazy(() => import("./pages/home"));
const DashBoardPage = React.lazy(() => import("./pages/dashboard"));
const LoginPage = React.lazy(() => import("./pages/login"));
const ForgotPassword = React.lazy(() => import("./pages/login/forgotpassword"));
const BanerPage = React.lazy(()=> import("./pages/banner"))
const Page401 = React.lazy(() => import("./pages/401"));
const Page404 = React.lazy(() => import("./pages/404"));

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
