import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import Me from "../pages/auth/Me.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import TeacherLessons from "../pages/teacher/TeacherLessons.jsx";
import TeacherCreateLesson from "../pages/teacher/TeacherCreateLesson.jsx";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/me",
                element: <Me />
            },
            {
                path: "/unauthorized",
                element: <Unauthorized />
            },
            {
                path: "/lessons",
                element: <TeacherLessons />
            },
            {
                path: "/create-lesson",
                element: <TeacherCreateLesson />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <RoleRoute allowedRoles={["student"]} />,
                        children: [
                            {
                                path: "/dashboard",
                                element: <h1>Student Dashboard</h1>
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);

export default router;