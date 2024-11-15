import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Admin from "./Pages/Admin/Admin";
import Classes from "./Pages/Classes/Classes";
import ClassSessions from "./Pages/ClassSessions/ClassSessions";
import Profile from "./Pages/Profile/Profile";
import Student from "./Pages/Student/Student";
import Attendance from "./Pages/Attendance/Attendance";
import AdminClasses from "./Pages/Admin/AdminClasses";
import AdminClassSessions from "./Pages/Admin/AdminClassSessions";
import { Toaster } from "./components/ui/toaster";
import ViewAttendances from "./Pages/ViewAttendances/ViewAttendances";

import Layout from "./Design/components/Layout";
import AuthLayout from "./Design/components/AuthLayout";
import ViewAttendancesBySemester from "./Pages/ViewAttendancesBySemester/ViewAttendancesBySemester";
import ViewAttendanceByStudent from "./Pages/ViewAttendanceByStudent/ViewAttendanceByStudent";
import ViewAttendanceByStudentBySem from "./Pages/ViewAttendanceByStudentBySem/ViewAttendanceByStudentBySem";
import ProtectedRoute from "./Design/components/ProtectedRoute";
import ForbiddenPage from "./Pages/ForbiddenPage/ForbiddenPage";

function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen relative max-w-[1440px] mx-auto flex flex-col">
      {isAuthRoute ? (
        <AuthLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthLayout>
      ) : (
        <Layout>
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<Admin />}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute
                    element={<Student />}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/attendance/:classId"
                element={
                  <ProtectedRoute
                    element={<Attendance />}
                    allowedRoles={["teacher", "admin"]}
                  />
                }
              />
              <Route
                path="/admin/classes"
                element={
                  <ProtectedRoute
                    element={<AdminClasses />}
                    allowedRoles={["admin"]}
                  />
                }
              />

              <Route
                path="/view/attendances/:classId"
                element={
                  <ProtectedRoute
                    element={<ViewAttendances />}
                    allowedRoles={["teacher", "admin"]}
                  />
                }
              />
              <Route
                path="/view/attendances/semester/:classId"
                element={
                  <ProtectedRoute
                    element={<ViewAttendancesBySemester />}
                    allowedRoles={["teacher", "admin"]}
                  />
                }
              />
              <Route
                path="/view/attendances/student/:classId"
                element={
                  <ProtectedRoute
                    element={<ViewAttendanceByStudent />}
                    allowedRoles={["teacher", "admin", "student"]}
                  />
                }
              />
              <Route
                path="/view/attendances/student/sem/:classId"
                element={
                  <ProtectedRoute
                    element={<ViewAttendanceByStudentBySem />}
                    allowedRoles={["teacher", "admin", "student"]}
                  />
                }
              />
              <Route path="/forbidden" element={<ForbiddenPage />} />
            </Routes>
          </div>
        </Layout>
      )}

      <Toaster />
    </div>
  );
}

export default App;
