import {createBrowserRouter, Navigate} from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Me from "../pages/auth/Me.jsx";
import Register from "../pages/auth/Register.jsx";

import AppLayout from "../components/layout/AppLayout.jsx";
import TeacherLayout from "../components/layout/TeacherLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";

import TeacherDashboard from "../pages/teacher/TeacherDashboard.jsx";
import TeacherLessons from "../pages/teacher/TeacherLessons.jsx";
import TeacherCreateLesson from "../pages/teacher/TeacherCreateLesson.jsx";

import Unauthorized from "../pages/Unauthorized.jsx";
import ParentDashboard from "../pages/parent/ParentDashboard.jsx";
import TeacherStudents from "../pages/teacher/TeacherStudents.jsx";

import TeacherAssistants from "../pages/teacher/TeacherAssistants.jsx";

import MarketplaceTeachers from "../pages/marketplace/MarketplaceTeachers.jsx";
import MarketplaceTeacherDetails from "../pages/marketplace/MarketplaceTeacherDetails.jsx";

import MyTeachers from "../pages/student/MyTeachers.jsx";
import StudentLessons from "../pages/student/StudentLessons.jsx";
import StudentLessonDetails from "../pages/student/StudentLessonDetails.jsx";
import StudentParentInvitation from "../pages/student/StudentParentInvitation.jsx";
import StudentLayout from "../components/layout/StudentLayout.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";

//parent
import ParentLayout from "../components/layout/ParentLayout.jsx";
import ParentLinkRequests from "../pages/parent/ParentLinkRequests.jsx";
import LinkedStudents from "../pages/parent/LinkedStudents.jsx";
import ChildOverview from "../pages/parent/ChildOverview.jsx";
import MonthlyReports from "../pages/parent/MonthlyReports";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/unauthorized",
                element: <Unauthorized />,
            },

            {
                path: "/marketplace/teachers",
                element: <MarketplaceTeachers />,
            },
            {
                path: "/marketplace/teachers/:id",
                element: <MarketplaceTeacherDetails />,
            },

            // Protected routes
            {
                element: <ProtectedRoute />,
                children: [
                    // Profile - available to all authenticated users
                    {
                        path: "/me",
                        element: <Me />,
                    },

                    // Teacher routes
                    {
                        element: <RoleRoute allowedRoles={["teacher"]} />,
                        children: [
                            {
                                path: "/teacher",
                                element: <TeacherLayout />,
                                children: [
                                    {
                                        path: "dashboard",
                                        element: <TeacherDashboard />,
                                    },
                                    {
                                        path: "lessons",
                                        element: <TeacherLessons />,
                                    },
                                    {
                                        path: "create-lesson",
                                        element: <TeacherCreateLesson />,
                                    },
                                    {
                                        path: "teacher-students",
                                        element: <TeacherStudents />,
                                    },
                                    {
                                        path: "assistants",
                                        element: <TeacherAssistants />,
                                    },

                                ],
                            },
                        ],
                    },


                    // Student routes

                    /* Student routes */
                    {
                        element: <RoleRoute allowedRoles={["student"]} />,
                        children: [
                            {
                                path: "/",
                                element: <StudentLayout />,
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="/dashboard" replace />,
                                    },
                                    {
                                        path: "dashboard",
                                        element: <StudentDashboard />,
                                    },
                                    {
                                        path: "my-teachers",
                                        element: <MyTeachers />,
                                    },
                                    {
                                        path: "student/lessons",
                                        element: <StudentLessons />,
                                    },
                                    {
                                        path: "student/lessons/:id",
                                        element: <StudentLessonDetails />,
                                    },
                                    {
                                        path: "student/invitation",
                                        element: <StudentParentInvitation />,
                                    },
                                    {
                                        path: "me",
                                        element: <Me />,
                                    },
                                ],
                            },
                        ],
                    },



                    // Parent routes
                    {
                        element: <RoleRoute allowedRoles={["parent"]} />,
                        children: [
                            {
                                path: "/parent",
                                element: <ParentLayout />,
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate
                                            to="/parent/dashboard"
                                            replace
                                        />,
                                    },
                                    {
                                        path: "dashboard",
                                        element: <ParentDashboard />,
                                    },
                                    {
                                        path: "link-requests",
                                        element: <ParentLinkRequests />,
                                    },
                                    {
                                        path: "link-student",
                                        element: <LinkedStudents />,
                                    },
                                    {
                                        path: "children/:studentId",
                                        element: <ChildOverview />,
                                    },
                                    {
                                        path: "reports",
                                        element: <MonthlyReports />,
                                    }
                                ],
                            },
                        ],
                    },

                ],
            },
        ],
    },
]);

export default router;