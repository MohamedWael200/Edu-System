import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import NotificationBell from "../../pages/notifications/NotificationBell.jsx";
import "./TeacherLayout.css";

function TeacherLayout() {
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="teacher-layout">
            <aside className="teacher-sidebar">
                <div className="teacher-brand">
                    <div className="teacher-brand-icon">E</div>

                    <div>
                        <h2>EduSystem</h2>
                        <span>Teacher Portal</span>
                    </div>
                </div>

                <div className="teacher-sidebar-label">
                    WORKSPACE
                </div>

                <nav className="teacher-nav">
                    <NavLink to="/teacher/dashboard" end>
                        <span className="teacher-nav-icon">⌂</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/teacher/lessons">
                        <span className="teacher-nav-icon">▤</span>
                        <span>My Lessons</span>
                    </NavLink>

                    <NavLink to="/teacher/create-lesson">
                        <span className="teacher-nav-icon">＋</span>
                        <span>Create Lesson</span>
                    </NavLink>
                </nav>

                <div className="teacher-sidebar-label teacher-sidebar-label-secondary">
                    MANAGEMENT
                </div>

                <nav className="teacher-nav">
                    <NavLink to="/teacher/teacher-students">
                        <span className="teacher-nav-icon">♙</span>
                        <span>My Students</span>
                    </NavLink>

                    <NavLink to="/teacher/assistants">
                        <span className="teacher-nav-icon">♧</span>
                        <span>My Assistants</span>
                    </NavLink>
                </nav>

                <div className="teacher-sidebar-label teacher-sidebar-label-secondary">
                    ACCOUNT
                </div>

                <nav className="teacher-nav">
                    <NavLink to="/me">
                        <span className="teacher-nav-icon">◎</span>
                        <span>My Profile</span>
                    </NavLink>
                </nav>

                <div className="teacher-sidebar-footer">
                    <div className="teacher-user-avatar">
                        {(user?.name || "T").charAt(0).toUpperCase()}
                    </div>

                    <div className="teacher-user-info">
                        <strong>{user?.name || "Teacher"}</strong>
                        <span>Teacher Account</span>
                    </div>
                </div>
            </aside>

            <div className="teacher-main">
                <header className="teacher-header">
                    <div className="teacher-header-welcome">
                        <span className="teacher-header-caption">
                            TEACHER PORTAL
                        </span>

                        <h1>
                            Welcome back, {user?.name || "Teacher"}
                        </h1>
                    </div>

                    <div className="teacher-header-actions">
                        <NotificationBell />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="teacher-logout-button"
                        >
                            <span aria-hidden="true">↪</span>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="teacher-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default TeacherLayout;
