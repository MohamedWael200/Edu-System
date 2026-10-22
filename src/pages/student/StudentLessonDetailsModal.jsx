
import { useEffect, useState } from "react";
import "../../assets/css/TeacherLessonDetailsModal.css";

function StudentLessonDetailsModal({
                                       lesson,
                                       loading,
                                       error,
                                       onClose,
                                   }) {
    const tabs = [
        { id: "video", label: "Video", available: !!lesson.video },
        { id: "sheet", label: "Sheet", available: !!lesson.sheet },
        { id: "exam", label: "Exam", available: !!lesson.exam },
    ];

    const availableTabs = tabs.filter((tab) => tab.available);

    const [activeTab, setActiveTab] = useState(
        availableTabs[0]?.id ?? "video"
    );

    const videoUrl = lesson.video?.file_path
        ? `http://127.0.0.1:8000/storage/${lesson.video.file_path.replace(/^\/+/, "")}`
        : null;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        if (!tabs.find((tab) => tab.id === activeTab)?.available) {
            setActiveTab(availableTabs[0]?.id ?? "video");
        }
    }, [lesson, activeTab]);

    const formatDate = (date) => {
        if (!date) return "Not scheduled";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const renderQuestions = (questions = []) => {
        if (!questions.length) {
            return <p className="modal-muted">No questions available.</p>;
        }

        return questions.map((question, index) => (
            <article className="modal-question" key={question.id ?? index}>
                <div className="modal-question-heading">
                    <span className="modal-question-number">
                        Q{index + 1}
                    </span>

                    <span className="modal-question-label">
                        Question
                    </span>
                </div>

                <p className="modal-question-text">
                    {question.question_text}
                </p>

                <div className="modal-options">
                    {Object.entries(question.options ?? {}).map(
                        ([key, option]) => (
                            <div className="modal-option" key={key}>
                                <span className="modal-option-key">
                                    {key}
                                </span>

                                <span className="modal-option-text">
                                    {option}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </article>
        ));
    };

    return (
        <div
            className="lesson-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="lesson-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="student-lesson-modal-title"
            >
                <header className="lesson-modal-header">
                    <div className="lesson-modal-heading">
                        <span className="lesson-modal-eyebrow">
                            LESSON DETAILS · #{lesson.id}
                        </span>

                        <h2 id="student-lesson-modal-title">
                            {lesson.title}
                        </h2>

                        <p>
                            Teacher: {lesson.teacher?.name || "Unknown"}
                        </p>

                        <p>
                            Published: {formatDate(lesson.published_at)}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="lesson-modal-close"
                        onClick={onClose}
                        aria-label="Close lesson details"
                    >
                        ×
                    </button>
                </header>

                <div className="lesson-modal-summary">
                    {tabs.map((tab) => (
                        <div className="modal-summary-item" key={tab.id}>
                            <span
                                className={`modal-status-dot ${
                                    tab.available ? "active" : ""
                                }`}
                            />

                            <span>{tab.label}</span>

                            <strong>
                                {tab.available ? "Available" : "Not added"}
                            </strong>
                        </div>
                    ))}
                </div>

                <nav
                    className="lesson-modal-tabs"
                    aria-label="Lesson content"
                >
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.id}
                            disabled={!tab.available}
                            className={`lesson-modal-tab ${
                                activeTab === tab.id ? "active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}

                            {tab.available && (
                                <span className="modal-tab-check">✓</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="lesson-modal-body">
                    {loading ? (
                        <div className="lessons-message">
                            <p>Loading lesson details...</p>
                        </div>
                    ) : error ? (
                        <div className="lessons-message lessons-error">
                            <h3>Could not load lesson details</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === "video" && (
                                lesson.video ? (
                                    <section className="modal-content-section">
                                        <span className="modal-section-kicker">
                                            LESSON MATERIAL
                                        </span>

                                        <h3>Video lesson</h3>

                                        <p className="modal-muted">
                                            Watch your lesson below.
                                        </p>

                                        {videoUrl ? (
                                            <div className="modal-video-wrapper">
                                                <video
                                                    className="modal-video-player"
                                                    controls
                                                    preload="metadata"
                                                >
                                                    <source
                                                        src={videoUrl}
                                                        type="video/mp4"
                                                    />
                                                    Your browser does not
                                                    support video playback.
                                                </video>
                                            </div>
                                        ) : (
                                            <p className="modal-muted">
                                                Video file is not available.
                                            </p>
                                        )}

                                        <div className="modal-info-card">
                                            <span className="modal-info-icon">
                                                ▶
                                            </span>

                                            <div>
                                                <span className="modal-info-label">
                                                    Video title
                                                </span>

                                                <h4>{lesson.video.title}</h4>
                                            </div>
                                        </div>

                                        <div className="modal-detail-row">
                                            <span>Duration</span>

                                            <strong>
                                                {lesson.video.duration ?? "—"} seconds
                                            </strong>
                                        </div>
                                    </section>
                                ) : (
                                    <p className="modal-muted">
                                        No video has been added to this lesson.
                                    </p>
                                )
                            )}

                            {activeTab === "sheet" && (
                                lesson.sheet ? (
                                    <section className="modal-content-section">
                                        <span className="modal-section-kicker">
                                            PRACTICE MATERIAL
                                        </span>

                                        <h3>{lesson.sheet.title}</h3>

                                        <p className="modal-muted">
                                            Review your practice material.
                                        </p>

                                        <div className="modal-metrics">
                                            <div>
                                                <span>Deadline</span>
                                                <strong>
                                                    {lesson.sheet.deadline_hours ?? "—"} hours
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Questions</span>
                                                <strong>
                                                    {lesson.sheet.questions?.length ?? 0}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="modal-questions-list">
                                            {renderQuestions(lesson.sheet.questions)}
                                        </div>
                                    </section>
                                ) : (
                                    <p className="modal-muted">
                                        No sheet has been added to this lesson.
                                    </p>
                                )
                            )}

                            {activeTab === "exam" && (
                                lesson.exam ? (
                                    <section className="modal-content-section">
                                        <span className="modal-section-kicker">
                                            ASSESSMENT
                                        </span>

                                        <h3>{lesson.exam.title}</h3>

                                        <p className="modal-muted">
                                            Review the exam information.
                                        </p>

                                        <div className="modal-metrics">
                                            <div>
                                                <span>Deadline</span>
                                                <strong>
                                                    {lesson.exam.deadline_hours ?? "—"} hours
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Max attempts</span>
                                                <strong>
                                                    {lesson.exam.max_attempts ?? "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Questions</span>
                                                <strong>
                                                    {lesson.exam.questions?.length ?? 0}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="modal-questions-list">
                                            {renderQuestions(lesson.exam.questions)}
                                        </div>
                                    </section>
                                ) : (
                                    <p className="modal-muted">
                                        No exam has been added to this lesson.
                                    </p>
                                )
                            )}
                        </>
                    )}
                </div>

                <footer className="lesson-modal-footer">
                    <span>
                        {availableTabs.length} content section
                        {availableTabs.length === 1 ? "" : "s"} available
                    </span>

                    <button
                        type="button"
                        className="modal-done-button"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </footer>
            </section>
        </div>
    );
}

export default StudentLessonDetailsModal;
