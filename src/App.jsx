import { lazy, Suspense, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/authContext";
import makeRequest from "./axios";

const Home = lazy(() => import("./pages/home/Home"));
const Register = lazy(() => import("./pages/register/Register"));
const Login = lazy(() => import("./pages/login/Login"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Notification = lazy(() => import("./pages/notification/Notification"));

import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const { data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await makeRequest.get("auth/get-me");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    setCurrentUser(data || null);
  }, [data, setCurrentUser]);

  return (
    <div className="flex max-w-6xl mx-auto overflow-x-hidden">
      {currentUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Home />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" />
            ) : (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Register />
              </Suspense>
            )
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" />
            ) : (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Login />
              </Suspense>
            )
          }
        />
        <Route
          path="/notifications"
          element={
            currentUser ? (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Notification />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            currentUser ? (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <Profile />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {currentUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
