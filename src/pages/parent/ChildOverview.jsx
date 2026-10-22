
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getChildOverview } from "../../features/parent/parentSlice";
import "../../assets/css/parent/ChildOverview.css";

export default function ChildOverview() {
    const { studentId } = useParams();
    const dispatch = useDispatch();

    const {
        childOverview,
        overviewLoading,
        overviewError,
    } = useSelector((state) => state.parent);

    useEffect(() => {
        dispatch(getChildOverview(studentId));
    }, [dispatch, studentId]);

    if (overviewLoading) {
        return (
            <div className="child-overview">
                <div className="child-overview__state">
                    <span className="child-overview__spinner" />
                    <p>Loading student overview...</p>
                </div>
            </div>
        );
    }

    if (overviewError) {
        return (
            <div className="child-overview">
                <div className="child-overview__state child-overview__state--error">
                    <h2>Unable to load student overview</h2>
                    <p>{overviewError}</p>

                    <button
                        className="child-overview__retry"
                        onClick={() => dispatch(getChildOverview(studentId))}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!childOverview) {
        return (
            <div className="child-overview">
                <div className="child-overview__empty">
                    <h3>No student data available</h3>
                    <p>Please try opening this page again.</p>
                </div>
            </div>
        );
    }

    const { student, academic_overview, enrollments } = childOverview;

    const stats = [
        {
            label: "Videos Watched",
            value: academic_overview.total_videos_watched,
            icon: "▶",
        },
        {
            label: "Videos Completed",
            value: academic_overview.videos_completed,
            icon: "✓",
        },
        {
            label: "Video Completion Rate",
            value: `${academic_overview.avg_video_completion_rate}%`,
            icon: "%",
        },
        {
            label: "Sheets Submitted",
            value: academic_overview.sheets_submitted_count,
            icon: "▤",
        },
        {
            label: "Average Sheet Score",
            value: academic_overview.avg_sheet_score,
            icon: "↗",
        },
        {
            label: "Exams Taken",
            value: academic_overview.exams_taken_count,
            icon: "▣",
        },
        {
            label: "Average Exam Score",
            value: academic_overview.avg_exam_score,
            icon: "★",
        },
    ];

    return (
        <main className="child-overview">
            <Link to="/parent/children" className="child-overview__back">
                <span aria-hidden="true">←</span>
                Back to Linked Students
            </Link>

            <header className="child-overview__header">
                <div className="child-overview__student-info">
                    <div className="child-overview__avatar">
                        {student.name?.trim().charAt(0) || "S"}
                    </div>

                    <div className="child-overview__identity">
                        <p className="child-overview__eyebrow">
                            STUDENT PROFILE
                        </p>

                        <h1>{student.name}</h1>

                        <p className="child-overview__email">
                            {student.email}
                        </p>
                    </div>
                </div>

                <span className="child-overview__badge">Student</span>
            </header>

            <section className="child-overview__section">
                <div className="child-overview__section-header">
                    <div>
                        <h2>Academic Overview</h2>
                        <p className="child-overview__section-description">
                            Track your child's learning progress and results.
                        </p>
                    </div>
                </div>

                <div className="child-overview__stats">
                    {stats.map((stat) => (
                        <article
                            className="child-overview__stat"
                            key={stat.label}
                        >
                            <div className="child-overview__stat-icon">
                                {stat.icon}
                            </div>

                            <p>{stat.label}</p>
                            <h3>{stat.value ?? "—"}</h3>
                        </article>
                    ))}
                </div>
            </section>

            <section className="child-overview__section">
                <div className="child-overview__section-header">
                    <div>
                        <h2>Teachers & Enrollments</h2>
                        <p className="child-overview__section-description">
                            View enrolled teachers, subjects, and violations.
                        </p>
                    </div>

                    <span className="child-overview__section-count">
                        {enrollments.length}
                    </span>
                </div>

                {enrollments.length === 0 ? (
                    <div className="child-overview__empty">
                        <h3>No enrollments found</h3>
                        <p>This student is not enrolled with any teachers yet.</p>
                    </div>
                ) : (
                    <div className="child-overview__teachers">
                        {enrollments.map((enrollment) => {
                            const teacher = enrollment.teacher;
                            const profile = teacher?.teacher_profile;

                            const status = String(
                                enrollment.status || "unknown"
                            ).toLowerCase();

                            const supportedStatuses = [
                                "active",
                                "pending",
                                "inactive",
                                "cancelled",
                                "rejected",
                            ];

                            const statusClass = supportedStatuses.includes(status)
                                ? status
                                : "default";

                            const violations = enrollment.violations_count ?? 0;

                            return (
                                <article
                                    className="child-overview__teacher"
                                    key={enrollment.id}
                                >
                                    <div className="child-overview__teacher-main">
                                        <div className="child-overview__teacher-avatar">
                                            {teacher?.name?.trim().charAt(0) || "T"}
                                        </div>

                                        <div className="child-overview__teacher-info">
                                            <h3>
                                                {teacher?.name ?? "Unknown Teacher"}
                                            </h3>

                                            <p>
                                                <strong>Subject:</strong>
                                                {profile?.subject ?? "—"}
                                            </p>

                                            <p>
                                                <strong>Stage:</strong>
                                                {profile?.subject_stage ?? "—"}
                                            </p>

                                            <p>
                                                <strong>Email:</strong>
                                                {teacher?.email ?? "—"}
                                            </p>

                                            <p>
                                                <strong>Phone:</strong>
                                                {teacher?.phone ?? "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="child-overview__teacher-meta">
                                        <span
                                            className={`child-overview__status child-overview__status--${statusClass}`}
                                        >
                                            {status}
                                        </span>

                                        <div
                                            className={`child-overview__violations ${
                                                violations > 0
                                                    ? "has-violations"
                                                    : ""
                                            }`}
                                        >
                                            Violations:
                                            <strong>{violations}</strong>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
