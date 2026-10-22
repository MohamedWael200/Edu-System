import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import NotificationBell from "../../pages/notifications/NotificationBell.jsx";
import "../../assets/css/student/StudentLayout.css";

function StudentLayout() {
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="student-layout">
            <aside className="student-sidebar">
                <div className="student-brand">
                    <div className="student-brand-icon">E</div>
                    <div>
                        <h2>EduSystem</h2>
                        <span>Student Portal</span>
                    </div>
                </div>

                <div className="student-sidebar-label">
                    LEARNING
                </div>

                <nav className="student-nav">
                    <NavLink to="/dashboard" end>
                        <span className="student-nav-icon">⌂</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/my-teachers">
                        <span className="student-nav-icon">♙</span>
                        <span>My Teachers</span>
                    </NavLink>

                    <NavLink to="/student/lessons">
                        <span className="student-nav-icon">▤</span>
                        <span>My Lessons</span>
                    </NavLink>

                </nav>

                <div className="student-sidebar-label student-sidebar-label-secondary">
                    ACCOUNT
                </div>

                <nav className="student-nav">
                    <NavLink to="/student/invitation">
                        <span className="student-nav-icon">♧</span>
                        <span>Parent Connection</span>
                    </NavLink>

                    <NavLink to="/me">
                        <span className="student-nav-icon">◎</span>
                        <span>My Profile</span>
                    </NavLink>
                </nav>

                <div className="student-sidebar-footer">
                    <div className="student-user-avatar">
                        {(user?.name || "S").charAt(0).toUpperCase()}
                    </div>

                    <div className="student-user-info">
                        <strong>{user?.name || "Student"}</strong>
                        <span>Student Account</span>
                    </div>
                </div>
            </aside>

            <div className="student-main">
                <header className="student-header">
                    <div className="student-header-welcome">
                        <span className="student-header-caption">
                            STUDENT PORTAL
                        </span>
                        <h1>
                            Welcome back, {user?.name || "Student"}
                        </h1>
                    </div>

                    <div className="student-header-actions">
                        <NotificationBell />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="student-logout-button"
                        >
                            <span aria-hidden="true">↪</span>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="student-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default StudentLayout;