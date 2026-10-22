import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/css/auth/ProtectedRoute.css";

function ProtectedRoute() {
    const { isAuthenticated, authInitialized } = useSelector(
        (state) => state.auth
    );

    if (!authInitialized) {
        return (
            <main className="auth-loading-page">
                <div className="auth-loading-card">
                    <div className="auth-loading-logo">E</div>

                    <div className="auth-loading-spinner"></div>

                    <h2>Getting things ready</h2>

                    <p>
                        We're securely checking your session.
                        <br />
                        Just a moment...
                    </p>

                    <div className="auth-loading-progress">
                        <span></span>
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="protected-content">
            <Outlet />
        </div>
    );
}

export default ProtectedRoute;