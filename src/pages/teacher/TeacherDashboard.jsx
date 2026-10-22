
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getLessons } from "../../features/teacher/teacherSlice.js";
import { getTeacherStudent } from "../../features/teacher/teacherStudentSlice.js";
import { getAssistants } from "../../features/assistantsSlice.js";

import "../../assets/css/TeacherDashboard.css";

function TeacherDashboard() {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const {
        lessons,
        loading: lessonsLoading,
        error: lessonsError,
    } = useSelector((state) => state.teacher);

    const {
        students,
        loading: studentsLoading,
        error: studentsError,
    } = useSelector((state) => state.teacherStudent);

    const {
        assistants,
        loading: assistantsLoading,
        error: assistantsError,
    } = useSelector((state) => state.assistants);

    useEffect(() => {
        dispatch(getLessons());
        dispatch(getTeacherStudent());
        dispatch(getAssistants());
    }, [dispatch]);

    const stats = [
        {
            title: "Total Lessons",
            count: lessons.length,
            loading: lessonsLoading,
            error: lessonsError,
            link: "/teacher/lessons",
        },
        {
            title: "Total Students",
            count: students.length,
            loading: studentsLoading,
            error: studentsError,
            link: "/teacher/students",
        },
        {
            title: "Total Assistants",
            count: assistants.length,
            loading: assistantsLoading,
            error: assistantsError,
            link: "/teacher/assistants",
        },
    ];

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-heading">
                <div>
                    <h1>Welcome, {user?.name || "Teacher"}!</h1>
                    <p>
                        Here's an overview of your educational platform.
                    </p>
                </div>

                <Link
                    to="/teacher/create-lesson"
                    className="dashboard-primary-action"
                >
                    + Create New Lesson
                </Link>
            </div>

            <section className="dashboard-section">
                <h2>Overview</h2>

                <div className="dashboard-stats">
                    {stats.map((stat) => (
                        <article
                            className="dashboard-stat-card"
                            key={stat.title}
                        >
                            <h3>{stat.title}</h3>

                            {stat.loading ? (
                                <p className="dashboard-stat-value">...</p>
                            ) : stat.error ? (
                                <p className="dashboard-stat-error">Failed</p>
                            ) : (
                                <p className="dashboard-stat-value">
                                    {stat.count}
                                </p>
                            )}

                            <Link to={stat.link}>
                                View details →
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <div className="dashboard-section-heading">
                    <h2>Recent Lessons</h2>

                    <Link to="/teacher/lessons">
                        View all lessons →
                    </Link>
                </div>

                {lessonsLoading ? (
                    <p>Loading lessons...</p>
                ) : lessonsError ? (
                    <p role="alert">
                        Failed to load lessons: {lessonsError}
                    </p>
                ) : lessons.length === 0 ? (
                    <div className="dashboard-empty">
                        <p>You haven't created any lessons yet.</p>

                        <Link to="/teacher/create-lesson">
                            Create your first lesson
                        </Link>
                    </div>
                ) : (
                    <div className="dashboard-recent-lessons">
                        {[...lessons]
                            .slice(-5)
                            .reverse()
                            .map((lesson) => (
                                <article
                                    className="dashboard-lesson-card"
                                    key={lesson.id}
                                >
                                    <div>
                                        <h3>{lesson.title}</h3>

                                        <p>
                                            {lesson.published_at
                                                ? new Date(
                                                    lesson.published_at
                                                ).toLocaleDateString()
                                                : "Publication date not set"}
                                        </p>
                                    </div>

                                    <Link to="/teacher/lessons">
                                        View lessons
                                    </Link>
                                </article>
                            ))}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Quick Actions</h2>

                <div className="dashboard-actions">
                    <Link
                        to="/teacher/lessons"
                        className="dashboard-action-link"
                    >
                        My Lessons
                    </Link>

                    <Link
                        to="/teacher/teacher-students"
                        className="dashboard-action-link"
                    >
                        My Students
                    </Link>

                    <Link
                        to="/teacher/assistants"
                        className="dashboard-action-link"
                    >
                        My Assistants
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default TeacherDashboard;
