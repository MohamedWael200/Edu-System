
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLessons , deleteLesson , getLessonDetails } from "../../features/teacher/teacherSlice.js";
import TeacherLessonDetailsModal from "./TeacherLessonDetailsModal.jsx";
import "../../assets/css/TeacherLessons.css";
import DeleteLessonModal from "../../components/teacher/DeleteLessonModal.jsx";

function TeacherLessons() {
    const dispatch = useDispatch();
    const [selectedLesson, setSelectedLesson] = useState(null);

    const [deletingLessonId, setDeletingLessonId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deleteMessageType, setDeleteMessageType] = useState("");
    const [lessonToDelete, setLessonToDelete] = useState(null);

    const {
        lessons,
        error,
        loading,
        deleteLoading,
        deleteError,
        lessonDetails,
        detailsLoading,
        detailsError,
    } = useSelector((state) => state.teacher);
    console.log("Lesson details:", lessonDetails);
    console.log("Details loading:", detailsLoading);
    console.log("Details error:", detailsError);
    const [expandedLesson, setExpandedLesson] = useState(null);

    useEffect(() => {
        dispatch(getLessons());
    }, [dispatch]);


    const handleViewDetails = (lesson) => {
        setSelectedLesson(lesson);
        dispatch(getLessonDetails(lesson.id));
    };


    const toggleDetails = (lessonId) => {
        setExpandedLesson((current) =>
            current === lessonId ? null : lessonId
        );
    };

    const formatDate = (date) => {
        if (!date) return "Not scheduled";

        return new Date(date).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const handleDeleteLesson = async (lesson) => {
        setDeletingLessonId(lesson.id);
        setDeleteMessage("");
        setDeleteMessageType("");

        try {
            await dispatch(deleteLesson(lesson.id)).unwrap();

            setDeleteMessage(
                `Lesson "${lesson.title}" was deleted successfully.`
            );
            setDeleteMessageType("success");

            if (selectedLesson?.id === lesson.id) {
                setSelectedLesson(null);
            }

            setLessonToDelete(null);
        } catch (error) {
            setDeleteMessage(
                typeof error === "string"
                    ? error
                    : "Failed to delete the lesson. Please try again."
            );
            setDeleteMessageType("error");
        } finally {
            setDeletingLessonId(null);
        }
    };

    if (loading) {
        return (
            <div className="lessons-message">
                <p>Loading lessons...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lessons-message lessons-error">
                <h3>Something went wrong</h3>
                <p>{error}</p>

                <button onClick={() => dispatch(getLessons())}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="teacher-lessons">
            <div className="lessons-header">
                <div>
                    <p className="lessons-eyebrow">TEACHER SPACE</p>
                    <h2>My Lessons</h2>
                    <p className="lessons-subtitle">
                        Manage your lessons and educational content.
                    </p>
                </div>

                <div className="lessons-count">
                    <span>Total Lessons</span>
                    <strong>{lessons.length}</strong>
                </div>
            </div>

            {deleteMessage && (
                <div
                    className={`lesson-delete-message ${deleteMessageType}`}
                    role={deleteMessageType === "error" ? "alert" : "status"}
                >
                    {deleteMessage}
                </div>
            )}

            {deleteError && !deleteMessage && (
                <div className="lesson-delete-message error" role="alert">
                    {deleteError}
                </div>
            )}

            {lessons.length === 0 ? (
                <div className="lessons-empty">
                    <h3>No lessons yet</h3>
                    <p>
                        Your lessons will appear here after you create one.
                    </p>
                </div>
            ) : (
                <div className="lessons-grid">
                    {lessons.map((lesson) => {
                        const isExpanded =
                            expandedLesson === lesson.id;

                        return (
                            <article
                                className="lesson-card"
                                key={lesson.id}
                            >
                                <div className="lesson-card-top">
                                    <span className="lesson-icon">
                                        <span aria-hidden="true">
                                            {"\u{1F4DA}"}
                                        </span>
                                    </span>

                                    <span className="lesson-id">
                                        Lesson #{lesson.id}
                                    </span>
                                </div>

                                <h3 className="lesson-title">
                                    {lesson.title}
                                </h3>

                                <p className="lesson-date">
                                    Published: {formatDate(lesson.published_at)}
                                </p>

                                <div className="lesson-content-tags">
                                    <span
                                        className={
                                            lesson.video
                                                ? "content-tag available"
                                                : "content-tag"
                                        }
                                    >
                                        Video {lesson.video ? "✓" : "—"}
                                    </span>

                                    <span
                                        className={
                                            lesson.sheet
                                                ? "content-tag available"
                                                : "content-tag"
                                        }
                                    >
                                        Sheet {lesson.sheet ? "✓" : "—"}
                                    </span>

                                    <span
                                        className={
                                            lesson.exam
                                                ? "content-tag available"
                                                : "content-tag"
                                        }
                                    >
                                        Exam {lesson.exam ? "✓" : "—"}
                                    </span>
                                </div>



                                <button
                                    type="button"
                                    className="lesson-details-button"
                                    onClick={() => handleViewDetails(lesson)}
                                    disabled={detailsLoading}
                                >
                                    {detailsLoading ? "Loading..." : "View Details"}
                                </button>


                                <button
                                    type="button"
                                    className="lesson-delete-button"
                                    onClick={() => setLessonToDelete(lesson)}
                                    disabled={deleteLoading && deletingLessonId === lesson.id}
                                >
                                    {deleteLoading && deletingLessonId === lesson.id
                                        ? "Deleting..."
                                        : "Delete Lesson"}
                                </button>

                            </article>
                        );
                    })}
                </div>

            )}


            {selectedLesson && (
                <TeacherLessonDetailsModal
                    lesson={
                        lessonDetails?.id === selectedLesson.id
                            ? lessonDetails
                            : selectedLesson
                    }
                    loading={detailsLoading}
                    error={detailsError}
                    onClose={() => setSelectedLesson(null)}
                />
            )}

            {lessonToDelete && (
                <DeleteLessonModal
                    lesson={lessonToDelete}
                    onCancel={() => setLessonToDelete(null)}
                    onConfirm={() => handleDeleteLesson(lessonToDelete)}
                    loading={
                        deleteLoading &&
                        deletingLessonId === lessonToDelete.id
                    }
                />
            )}

        </div>
    );
}

export default TeacherLessons;
