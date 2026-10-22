import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, logout } from "../../features/auth/authSlice.js";
import "../../assets/css/auth/Me.css";
function Me() {
    const dispatch = useDispatch();

    const {
        user,
        authLoading,
        error,
        isAuthenticated,
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getMe());
        }
    }, [dispatch, isAuthenticated, user]);

    const handleLogout = () => {
        dispatch(logout());
    };

if (authLoading) {
    return (
        <main className="profile-page">
            <div className="profile-loading">
                <span className="profile-spinner"></span>
                <p>Loading your profile...</p>
            </div>
        </main>
    );
}

if (!user) {
    return (
        <main className="profile-page">
            <section className="profile-empty">
                <div className="profile-empty-icon">!</div>
                <h2>Profile unavailable</h2>
                <p>{error || "No user data available."}</p>
            </section>
        </main>
    );
}

const initials = user.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

return (
    <main className="profile-page">
        <div className="profile-container">

            <header className="profile-header">
                <div>
                    <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account details.</p>
                </div>

                <span className="profile-role-badge">
                    {user.role}
                </span>
            </header>

            {error && (
                <div className="profile-error" role="alert">
                    {error}
                </div>
            )}

            <section className="profile-hero">
                <div className="profile-avatar">{initials}</div>

                <div className="profile-hero-info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>

                    <span className={`profile-status ${user.email_verified_at ? "is-verified" : ""}`}>
                        <span className="profile-status-dot"></span>
                        {user.email_verified_at ? "Verified account" : "Email not verified"}
                    </span>
                </div>
            </section>

            <div className="profile-content">

                <section className="profile-card">
                    <div className="profile-card-heading">
                        <div className="profile-card-icon">01</div>
                        <div>
                            <h3>Personal Information</h3>
                            <p>Your basic account details</p>
                        </div>
                    </div>

                    <div className="profile-details-grid">
                        <div className="profile-detail">
                            <span>Full Name</span>
                            <strong>{user.name || "Not provided"}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Email Address</span>
                            <strong>{user.email || "Not provided"}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Phone Number</span>
                            <strong>{user.phone || "Not provided"}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Account Role</span>
                            <strong className="profile-capitalize">
                                {user.role}
                            </strong>
                        </div>

                        <div className="profile-detail">
                            <span>User ID</span>
                            <strong>#{user.id}</strong>
                        </div>

                        <div className="profile-detail">
                            <span>Email Verification</span>
                            <strong className={
                                user.email_verified_at
                                    ? "profile-verified"
                                    : "profile-unverified"
                            }>
                                {user.email_verified_at
                                    ? "Verified"
                                    : "Not verified"}
                            </strong>
                        </div>

                        <div className="profile-detail profile-detail-full">
                            <span>Member Since</span>
                            <strong>
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )
                                    : "Unknown"}
                            </strong>
                        </div>
                    </div>
                </section>

                {user.role === "teacher" && user.teacher_profile && (
                    <section className="profile-card">
                        <div className="profile-card-heading">
                            <div className="profile-card-icon">02</div>
                            <div>
                                <h3>Teaching Information</h3>
                                <p>Your subject and teaching details</p>
                            </div>
                        </div>

                        <div className="profile-details-grid">
                            <div className="profile-detail">
                                <span>Subject</span>
                                <strong>
                                    {user.teacher_profile.subject || "Not provided"}
                                </strong>
                            </div>

                            <div className="profile-detail">
                                <span>Teaching Stage</span>
                                <strong>
                                    {user.teacher_profile.subject_stage || "Not provided"}
                                </strong>
                            </div>

                            <div className="profile-detail profile-detail-full">
                                <span>About Me</span>
                                <strong className="profile-bio">
                                    {user.teacher_profile.bio || "No bio available"}
                                </strong>
                            </div>
                        </div>
                    </section>
                )}

            </div>

            <footer className="profile-footer">
                <p>Keep your account information up to date.</p>

                <button
                    className="profile-logout-button"
                    type="button"
                    onClick={handleLogout}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                    </svg>
                    Logout
                </button>
            </footer>

            <p className="profile-copyright">
                © {new Date().getFullYear()} EduFlow. All rights reserved.
            </p>

        </div>
    </main>
);

}

export default Me;