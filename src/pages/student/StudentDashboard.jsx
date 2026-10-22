import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStudentLessons } from "../../features/student/studentLessonsSlice.js";
import "../../assets/css/student/StudentDashboard.css";

export default function StudentDashboard() {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { lessons = [], loading, error } = useSelector(
        (state) => state.studentLessons
    );

    useEffect(() => {
        dispatch(getStudentLessons());
    }, [dispatch]);

    const lessonCount = lessons.length;

    const publishedCount = lessons.filter(
        (lesson) => lesson.status === "published"
    ).length;

    return (
        <div className="student-dashboard">
            <section className="student-dashboard-hero">
                <div className="student-dashboard-hero-content">
                    <span className="student-dashboard-eyebrow">
                        YOUR LEARNING SPACE
                    </span>

                    <h2>Keep learning, keep growing.</h2>

                    <p>
                        Welcome{user?.name ? `, ${user.name}` : ""}!
                        Continue your lessons and stay on track with
                        your learning journey.
                    </p>

                    <Link
                        to="/student/lessons"
                        className="student-dashboard-primary-link"
                    >
                        Explore My Lessons <span>→</span>
                    </Link>
                </div>

                <div
                    className="student-dashboard-hero-art"
                    aria-hidden="true"
                >
                    <div className="student-dashboard-art-circle">
                        <span>✦</span>
                    </div>
                    <div className="student-dashboard-art-book">▤</div>
                </div>
            </section>

            <section className="student-dashboard-section">
                <div className="student-dashboard-section-heading">
                    <div>
                        <h2>Learning Overview</h2>
                        <p>A quick look at your learning activity.</p>
                    </div>
                </div>

                <div className="student-dashboard-stats">
                    <article className="student-dashboard-stat-card">
                        <div className="student-dashboard-stat-icon lessons">
                            ▤
                        </div>
                        <div>
                            <span>Total Lessons</span>
                            <strong>
                                {loading ? "—" : lessonCount}
                            </strong>
                            <p>Lessons available to you</p>
                        </div>
                    </article>

                    <article className="student-dashboard-stat-card">
                        <div className="student-dashboard-stat-icon published">
                            ✓
                        </div>
                        <div>
                            <span>Published Lessons</span>
                            <strong>
                                {loading ? "—" : publishedCount}
                            </strong>
                            <p>Ready for learning</p>
                        </div>
                    </article>
                </div>
            </section>

            <section className="student-dashboard-section">
                <div className="student-dashboard-section-heading">
                    <div>
                        <h2>Quick Access</h2>
                        <p>Jump straight to what you need.</p>
                    </div>
                </div>

                <div className="student-dashboard-quick-links">
                    <Link
                        to="/student/lessons"
                        className="student-dashboard-quick-card"
                    >
                        <span className="student-dashboard-quick-icon blue">
                            ▤
                        </span>
                        <span className="student-dashboard-quick-text">
                            <strong>My Lessons</strong>
                            <small>View lessons and learning materials</small>
                        </span>
                        <span className="student-dashboard-arrow">→</span>
                    </Link>

                    <Link
                        to="/my-teachers"
                        className="student-dashboard-quick-card"
                    >
                        <span className="student-dashboard-quick-icon purple">
                            ♙
                        </span>
                        <span className="student-dashboard-quick-text">
                            <strong>My Teachers</strong>
                            <small>Explore your connected teachers</small>
                        </span>
                        <span className="student-dashboard-arrow">→</span>
                    </Link>

                    <Link
                        to="/student/invitation"
                        className="student-dashboard-quick-card"
                    >
                        <span className="student-dashboard-quick-icon green">
                            ♧
                        </span>
                        <span className="student-dashboard-quick-text">
                            <strong>Parent Connection</strong>
                            <small>Invite a parent or guardian</small>
                        </span>
                        <span className="student-dashboard-arrow">→</span>
                    </Link>
                </div>
            </section>

            {error && (
                <div className="student-dashboard-error" role="alert">
                    Unable to load your lessons: {error}
                </div>
            )}
        </div>
    );
}