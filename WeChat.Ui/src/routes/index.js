import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layouts/mainLayout";
import AuthLayout from "../layouts/AuthLayout";
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import ProfilePage from "../pages/chat/ProfilePage";
import ContactPage from "@/pages/chat/ContactPage";


const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};
const ChatPage = Loadable(
  lazy(() => import("../pages/chat/ChatPage"))
);

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <VerifyPage />, path: "verify" },
        { element: <ResetPassword />, path: "reset-Password" },
        { element: <NewPassword />, path: "new-Password" },
      ]
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "/chat/", element: <ChatPage /> },
        { path: "/chat/:roomId", element: <ChatPage /> },
        { path: "/contact", element: <ContactPage /> },
        { path: "/user/:userId", element: <ProfilePage/>},
        { path: "/404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const VerifyPage = Loadable(lazy(() => import("../pages/auth/verify")))
const RegisterPage = Loadable(lazy(() => import("../pages/auth/register")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/login")));
const ResetPassword = Loadable(lazy(() => import("../pages/auth/resetPassword")));
const NewPassword = Loadable(lazy(() => import("../pages/auth/newPassword")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
