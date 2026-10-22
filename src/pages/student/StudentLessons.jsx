
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getStudentLessons } from "../../features/student/studentLessonsSlice.js";
import "../../assets/css/student/StudentLessons.css";

function StudentLessons() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { lessons, loading, error } = useSelector(
        (state) => state.studentLessons
    );

    useEffect(() => {
        dispatch(getStudentLessons());
    }, [dispatch]);

    return (
        <div className="student-lessons-page">
            <header className="lessons-header">
                <div>
                    <h1>My Lessons</h1>
                    <p>Explore your lessons and learning materials.</p>
                </div>

                <span className="lessons-count">
                    {lessons.length} Lessons
                </span>
            </header>

            {loading && (
                <p className="lessons-message">Loading lessons...</p>
            )}

            {!loading && error && (
                <p className="lessons-message lessons-error">
                    {error}
                </p>
            )}

            {!loading && !error && lessons.length === 0 && (
                <p className="lessons-message">
                    No lessons available yet.
                </p>
            )}

            {!loading && !error && lessons.length > 0 && (
                <div className="lessons-grid">
                    {lessons.map((lesson) => (
                        <article className="lesson-card" key={lesson.id}>
                            <div className="lesson-card-top">
                                <span className="lesson-subject">
                                    {lesson.teacher?.teacher_profile?.subject ||
                                        "General"}
                                </span>

                                <span className="lesson-id">
                                    Lesson #{lesson.id}
                                </span>
                            </div>

                            <h2>{lesson.title}</h2>

                            <div className="lesson-teacher">
                                <div className="teacher-avatar">
                                    {(lesson.teacher?.name || "T")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <span className="info-label">Teacher</span>
                                    <p>{lesson.teacher?.name || "Unknown"}</p>
                                </div>
                            </div>

                            <div className="lesson-details">
                                <div>
                                    <span className="info-label">Stage</span>
                                    <p>
                                        {lesson.teacher?.teacher_profile
                                            ?.subject_stage || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="lesson-content">
                                <span
                                    className={
                                        lesson.video
                                            ? "content-tag available"
                                            : "content-tag"
                                    }
                                >
                                    {lesson.video ? "▶ Video" : "No video"}
                                </span>

                                <span
                                    className={
                                        lesson.sheet
                                            ? "content-tag available"
                                            : "content-tag"
                                    }
                                >
                                    {lesson.sheet ? "▤ Sheet" : "No sheet"}
                                </span>

                                <span
                                    className={
                                        lesson.exam
                                            ? "content-tag available"
                                            : "content-tag"
                                    }
                                >
                                    {lesson.exam ? "✎ Exam" : "No exam"}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="view-lesson-button"
                                onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                            >
                                View Details
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentLessons;
