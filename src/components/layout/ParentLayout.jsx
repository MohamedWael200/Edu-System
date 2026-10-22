
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import NotificationBell from "../../pages/notifications/NotificationBell.jsx";
import "../../assets/css/parent/ParentLayout.css";

function ParentLayout() {
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="parent-layout">
            <aside className="parent-sidebar">
                <div className="parent-brand">
                    <div className="parent-brand-icon">E</div>

                    <div>
                        <h2>EduSystem</h2>
                        <span>Parent Portal</span>
                    </div>
                </div>

                <div className="parent-sidebar-label">
                    OVERVIEW
                </div>

                <nav className="parent-nav">
                    <NavLink to="/parent/dashboard" end>
                        <span className="parent-nav-icon">⌂</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/parent/link-requests">
                        <span className="parent-nav-icon">♧</span>
                        <span>Link Requests</span>
                    </NavLink>

                    <NavLink to="/parent/link-student">
                        <span className="parent-nav-icon">♧</span>
                        <span>Link Student</span>
                    </NavLink>

                    <NavLink to="/parent/reports">
                        <span className="parent-nav-icon">▤</span>
                        <span>Monthly Reports</span>
                    </NavLink>
                </nav>

                <div className="parent-sidebar-label parent-sidebar-label-secondary">
                    ACCOUNT
                </div>

                <nav className="parent-nav">
                    <NavLink to="/me">
                        <span className="parent-nav-icon">◎</span>
                        <span>My Profile</span>
                    </NavLink>
                </nav>

                <div className="parent-sidebar-footer">
                    <div className="parent-user-avatar">
                        {(user?.name || "P").charAt(0).toUpperCase()}
                    </div>

                    <div className="parent-user-info">
                        <strong>{user?.name || "Parent"}</strong>
                        <span>Parent Account</span>
                    </div>
                </div>
            </aside>

            <div className="parent-main">
                <header className="parent-header">
                    <div className="parent-header-welcome">
                        <span className="parent-header-caption">
                            PARENT PORTAL
                        </span>

                        <h1>
                            Welcome back, {user?.name || "Parent"}
                        </h1>
                    </div>

                    <div className="parent-header-actions">
                        <NotificationBell />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="parent-logout-button"
                        >
                            <span aria-hidden="true">↪</span>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="parent-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ParentLayout;
