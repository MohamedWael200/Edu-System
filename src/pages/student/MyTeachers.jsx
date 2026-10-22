import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getStudentEnrollments } from "../../features/student/studentEnrollmentSlice.js";

function MyTeachers() {
    const dispatch = useDispatch();

    const {
        enrollments,
        loading,
        error,
    } = useSelector((state) => state.studentEnrollments);

    useEffect(() => {
        dispatch(getStudentEnrollments());
    }, [dispatch]);

    if (loading) {
        return (
            <main className="my-teachers-page">
                <p>Loading your teachers...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="my-teachers-page">
                <h2>Unable to load your teachers</h2>
                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => dispatch(getStudentEnrollments())}
                >
                    Try again
                </button>
            </main>
        );
    }

    return (
        <main className="my-teachers-page">
            <header className="my-teachers-header">
                <div>
                    <span className="marketplace-eyebrow">
                        YOUR LEARNING
                    </span>

                    <h1>My Teachers</h1>

                    <p>
                        View the teachers you are enrolled with.
                    </p>
                </div>

                <Link
                    to="/marketplace/teachers"
                    className="my-teachers-browse-link"
                >
                    Browse Teachers
                </Link>
            </header>

            {enrollments.length === 0 ? (
                <section className="my-teachers-empty">
                    <h2>You haven't enrolled with any teachers yet</h2>

                    <p>
                        Browse available teachers and enroll to get started.
                    </p>

                    <Link to="/marketplace/teachers">
                        Explore Teachers
                    </Link>
                </section>
            ) : (
                <section className="my-teachers-grid">
                    {enrollments.map((enrollment) => {
                        const teacher = enrollment.teacher || {};
                        const profile = teacher.teacher_profile || {};

                        const initials = (teacher.name || "T")
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase();

                        return (
                            <article
                                className="my-teacher-card"
                                key={enrollment.id}
                            >
                                <div className="my-teacher-card-top">
                                    <div className="my-teacher-avatar">
                                        {initials}
                                    </div>

                                    <span
                                        className={`my-teacher-status status-${(
    enrollment.status || "unknown"
).toLowerCase()}`}
                                    >
                                        {enrollment.status || "Unknown"}
                                    </span>
                                </div>

                                <h2>{teacher.name || "Unnamed teacher"}</h2>

                                <p className="my-teacher-subject">
                                    {profile.subject || "Subject not specified"}
                                </p>

                                <div className="my-teacher-details">
                                    <div>
                                        <span>Stage</span>
                                        <strong>
                                            {profile.subject_stage ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {teacher.email || "Not provided"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Enrolled on</span>
                                        <strong>
                                            {enrollment.created_at
                                                ? new Date(
                                                      enrollment.created_at
                                                  ).toLocaleDateString()
                                                : "Unknown"}
                                        </strong>
                                    </div>
                                </div>

                                <Link
                                    to={`/marketplace/teachers/${teacher.id}`}
                                    className="my-teacher-view-link"
                                >
                                    View Teacher Profile
                                </Link>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default MyTeachers;