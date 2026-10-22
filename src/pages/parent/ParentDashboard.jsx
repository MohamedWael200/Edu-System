import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getLinkedStudents,
    getLinkRequests,
} from "../../features/parent/parentSlice.js";
import "../../assets/css/parent/ParentDashboard.css";

export default function ParentDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const {
        linkedStudents,
        studentsLoading,
        studentsError,
        linkRequests,
    } = useSelector((state) => state.parent);

    const students = Array.isArray(linkedStudents)
        ? linkedStudents
        : [];

    const requests = Array.isArray(linkRequests)
        ? linkRequests
        : [];

    useEffect(() => {
        dispatch(getLinkedStudents());
        dispatch(getLinkRequests());
    }, [dispatch]);

    const pendingRequests = requests.filter(
        (request) =>
            String(request.status || "").toLowerCase() === "pending"
    ).length;

    const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

    return (
        <div className="parent-dashboard">
            {/* Welcome */}
            <section className="parent-dashboard-hero">
                <div className="parent-dashboard-hero-content">
                    <span className="parent-dashboard-eyebrow">
                        PARENT PORTAL
                    </span>

                    <h2>Stay connected to their learning journey.</h2>

                    <p>
                        Welcome back, {firstName}! Follow your children's
                        educational journey, explore their progress, and
                        stay connected with their teachers.
                    </p>

                    <Link
                        to="/parent/children"
                        className="parent-dashboard-primary-link"
                    >
                        Explore My Children <span>→</span>
                    </Link>
                </div>

                <div
                    className="parent-dashboard-hero-art"
                    aria-hidden="true"
                >
                    <div className="parent-dashboard-art-circle">
                        <span>✦</span>
                    </div>
                    <div className="parent-dashboard-art-icon">♧</div>
                </div>
            </section>

            {/* Overview */}
            <section className="parent-dashboard-section">
                <div className="parent-dashboard-section-heading">
                    <div>
                        <h2>Family Overview</h2>
                        <p>A quick look at your account activity.</p>
                    </div>
                </div>

                <div className="parent-dashboard-stats">
                    <article className="parent-dashboard-stat-card">
                        <div className="parent-dashboard-stat-icon children">
                            ♧
                        </div>
                        <div>
                            <span>Linked Children</span>
                            <strong>
                                {studentsLoading ? "—" : students.length}
                            </strong>
                            <p>Children connected to your account</p>
                        </div>
                    </article>

                    <article className="parent-dashboard-stat-card">
                        <div className="parent-dashboard-stat-icon requests">
                            ◷
                        </div>
                        <div>
                            <span>Pending Requests</span>
                            <strong>{pendingRequests}</strong>
                            <p>Requests waiting for your attention</p>
                        </div>
                    </article>
                </div>
            </section>

            {/* Children */}
            <section className="parent-dashboard-section">
                <div className="parent-dashboard-section-heading">
                    <div>
                        <h2>My Children</h2>
                        <p>Access your children's learning information.</p>
                    </div>

                    <Link
                        to="/parent/link-requests"
                        className="parent-dashboard-text-link"
                    >
                        Link Requests →
                    </Link>
                </div>

                {studentsLoading ? (
                    <div className="parent-dashboard-state">
                        <span className="parent-dashboard-spinner" />
                        <p>Loading your children...</p>
                    </div>
                ) : studentsError ? (
                    <div className="parent-dashboard-error" role="alert">
                        Unable to load your children: {studentsError}
                    </div>
                ) : students.length === 0 ? (
                    <div className="parent-dashboard-empty">
                        <div className="parent-dashboard-empty-icon">♧</div>
                        <h3>No children linked yet</h3>
                        <p>
                            Connect your account with a student to follow
                            their learning journey.
                        </p>
                        <Link
                            to="/parent/link-requests"
                            className="parent-dashboard-action-link"
                        >
                            View Link Requests
                        </Link>
                    </div>
                ) : (
                    <div className="parent-dashboard-children">
                        {students.slice(0, 4).map((student) => (
                            <article
                                className="parent-dashboard-child-card"
                                key={student.id}
                            >
                                <div className="parent-dashboard-child-avatar">
                                    {(student.name || "S")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="parent-dashboard-child-info">
                                    <h3>{student.name || "Student"}</h3>
                                    <p>
                                        {student.email || "Linked student"}
                                    </p>
                                    <span className="parent-dashboard-status">
                                        <span />
                                        Connected
                                    </span>
                                </div>

                                <Link
                                    to={`/parent/children/${student.id}`}
                                    className="parent-dashboard-child-link"
                                    aria-label={`View ${student.name || "student"} details`}
                                    title="View student details"
                                >
                                    →
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

                {!studentsLoading && students.length > 4 && (
                    <Link
                        to="/parent/children"
                        className="parent-dashboard-view-all"
                    >
                        View all {students.length} children →
                    </Link>
                )}
            </section>

            {/* Quick Access */}
            <section className="parent-dashboard-section">
                <div className="parent-dashboard-section-heading">
                    <div>
                        <h2>Quick Access</h2>
                        <p>Jump straight to what you need.</p>
                    </div>
                </div>

                <div className="parent-dashboard-quick-links">
                    <Link
                        to="/parent/children"
                        className="parent-dashboard-quick-card"
                    >
                        <span className="parent-dashboard-quick-icon teal">
                            ♧
                        </span>
                        <span className="parent-dashboard-quick-text">
                            <strong>My Children</strong>
                            <small>View linked students and their details</small>
                        </span>
                        <span className="parent-dashboard-arrow">→</span>
                    </Link>

                    <Link
                        to="/parent/link-requests"
                        className="parent-dashboard-quick-card"
                    >
                        <span className="parent-dashboard-quick-icon blue">
                            ⇄
                        </span>
                        <span className="parent-dashboard-quick-text">
                            <strong>Link Requests</strong>
                            <small>Manage parent-student connections</small>
                        </span>
                        <span className="parent-dashboard-arrow">→</span>
                    </Link>

                    <Link
                        to="/parent/reports"
                        className="parent-dashboard-quick-card"
                    >
                        <span className="parent-dashboard-quick-icon purple">
                            ▤
                        </span>
                        <span className="parent-dashboard-quick-text">
                            <strong>Monthly Reports</strong>
                            <small>Download monthly student reports</small>
                        </span>
                        <span className="parent-dashboard-arrow">→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}