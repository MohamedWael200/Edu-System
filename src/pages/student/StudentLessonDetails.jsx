
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getStudentLessonDetails,
    clearSelectedLesson,
    submitSheet,
    submitExam,
    updateVideoProgress,
} from "../../features/student/studentLessonsSlice.js";
import "../../assets/css/student/StudentLessonDetails.css";

function StudentLessonDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("video");
    const [answers, setAnswers] = useState({});
    const [examAnswers, setExamAnswers] = useState({});

    const {
        selectedLesson,
        detailsLoading,
        detailsError,
    } = useSelector((state) => state.studentLessons);

    const {
        sheetSubmitting,
        sheetSubmitError,
        sheetResult,
    } = useSelector((state) => state.studentLessons);

    const {
        examSubmitting,
        examSubmitError,
        examResult,
    } = useSelector((state) => state.studentLessons);

    const {
        videoProgressUpdating,
        videoProgressError,
        videoProgress,
    } = useSelector((state) => state.studentLessons);

    useEffect(() => {
        dispatch(getStudentLessonDetails(id));

        return () => {
            dispatch(clearSelectedLesson());
        };
    }, [dispatch, id]);

    const handleSubmitSheet = (event) => {
        event.preventDefault();

        if (!selectedLesson?.sheet?.id) {
            return;
        }

        dispatch(
            submitSheet({
                sheetId: selectedLesson.sheet.id,
                answers,
            })
        );
    };

    const handleSubmitExam = (event) => {
        event.preventDefault();

        if (!selectedLesson?.exam?.id) {
            return;
        }


        dispatch(
            submitExam({
                examId: selectedLesson.exam.id,
                answers: examAnswers,
            })
        );
    };

    if (detailsLoading) {
        return (
            <div className="student-lesson-details">
                <div className="loading-state">
                    Loading lesson details...
                </div>
            </div>
        );
    }

    if (detailsError) {
        return (
            <div className="student-lesson-details">
                <div className="error-state">{detailsError}</div>
                <Link className="back-link" to="/student/lessons">
                    ← Back to lessons
                </Link>
            </div>
        );
    }

    if (!selectedLesson) {
        return (
            <div className="student-lesson-details">
                <div className="empty-state">
                    Lesson not found.
                </div>
                <Link className="back-link" to="/student/lessons">
                    ← Back to lessons
                </Link>
            </div>
        );
    }

    console.log("Selected video:", selectedLesson.video);
    const videoUrl = selectedLesson.video?.file_path
        ? `http://127.0.0.1:8000/storage/${selectedLesson.video.file_path.replace(/^\/+/, "")}`
        : null;


    const renderQuestions = (questions = []) => {
        if (!questions.length) {
            return (
                <div className="empty-state">
                    No questions available.
                </div>
            );
        }

        return (
            <div className="questions-list">
                {questions.map((question, index) => {

                    let options = question.options;

                    if (typeof options === "string") {
                        try {
                            options = JSON.parse(options);
                        } catch {
                            options = [];
                        }
                    }

                    const normalizedOptions = Array.isArray(options)
                        ? options.map((option, i) => [
                            String(i),
                            typeof option === "object" && option !== null
                                ? option.text ?? option.label ?? JSON.stringify(option)
                                : option,
                        ])
                        : options && typeof options === "object"
                            ? Object.entries(options)
                            : [];

                    const isExam = activeTab === "exam";
                    const selectedAnswers = isExam ? examAnswers : {};

                    return (
                        <article
                            className="question-card"
                            key={question.id ?? index}
                        >
                            <h4>
                                {index + 1}. {question.question_text}
                            </h4>

                            {normalizedOptions.map(([key, value]) => {
                                const optionValue = String(value);

                                return (
                                    <label
                                        className="question-option"
                                        key={key}
                                    >
                                        {isExam && (
                                            <input
                                                type="radio"
                                                name={`exam-question-${question.id}`}
                                                value={optionValue}
                                                checked={
                                                    selectedAnswers[question.id] === optionValue
                                                }
                                                onChange={() => {
                                                    setExamAnswers(previous => ({
                                                        ...previous,
                                                        [question.id]: optionValue,
                                                    }));
                                                }}
                                            />
                                        )}

                                        <span className="option-label">
                                        {Array.isArray(options)
                                            ? String(Number(key) + 1)
                                            : key}
                                    </span>

                                        <span>{optionValue}</span>
                                    </label>
                                );
                            })}
                        </article>
                    );
                })}
            </div>
        );
    };


    return (
        <main className="student-lesson-details">
            <Link className="back-link" to="/student/lessons">
                ← Back to lessons
            </Link>

            <header className="lesson-header">
                <h1>{selectedLesson.title}</h1>

                <p>
                    {selectedLesson.teacher?.name
                        ? `Instructor: ${selectedLesson.teacher.name}`
                        : "Lesson details and learning materials"}
                </p>
            </header>

            <nav className="lesson-tabs">
                <button
                    type="button"
                    className={activeTab === "video" ? "active" : ""}
                    onClick={() => setActiveTab("video")}
                >
                    Video
                </button>

                <button
                    type="button"
                    className={activeTab === "sheet" ? "active" : ""}
                    onClick={() => setActiveTab("sheet")}
                >
                    Sheet
                </button>

                <button
                    type="button"
                    className={activeTab === "exam" ? "active" : ""}
                    onClick={() => setActiveTab("exam")}
                >
                    Exam
                </button>
            </nav>

            <section className="lesson-content">
                {activeTab === "video" && (
                    <>
                        <h2>
                            {selectedLesson.video?.title || "Lesson Video"}
                        </h2>

                        {videoUrl ? (
                            <video
                                className="lesson-video"
                                controls
                                src={videoUrl}
                                onTimeUpdate={(event) => {
                                    const video = event.currentTarget;

                                    if (!video.duration || !selectedLesson.video?.id) {
                                        return;
                                    }

                                    const watchedPercentage =
                                        (video.currentTime / video.duration) * 100;

                                    if (watchedPercentage >= 90) {
                                        dispatch(
                                            updateVideoProgress({
                                                videoId: selectedLesson.video.id,
                                                watchedPercentage: Number(
                                                    watchedPercentage.toFixed(2)
                                                ),
                                            })
                                        );
                                    }
                                }}
                            >
                                Your browser does not support video playback.
                            </video>
                        ) : (
                            <div className="empty-state">
                                No video available for this lesson.
                            </div>
                        )}
                    </>
                )}


                {activeTab === "sheet" && (
                    <>
                        <h2>{selectedLesson.sheet?.title || "Sheet"}</h2>

                        {sheetResult ? (
                            <div className="sheet-result">
                                <h3>Sheet Submitted Successfully!</h3>

                                <p>
                                    Score:{" "}
                                    {sheetResult.grade_details?.score ??
                                        sheetResult.submission?.score ??
                                        0}
                                </p>

                                <p>
                                    Correct Answers:{" "}
                                    {sheetResult.grade_details?.correct_count ?? 0}
                                    {" / "}
                                    {sheetResult.grade_details?.total_questions ?? 0}
                                </p>

                                <div className="exam-review">
                                    <h3>Review Your Answers</h3>

                                    {sheetResult.grade_details?.details?.map((detail, index) => {
                                        const question = selectedLesson.sheet?.questions?.find(
                                            (item) => item.id === detail.question_id
                                        );

                                        return (
                                            <div
                                                key={detail.question_id}
                                                className={`exam-review-question ${
                                                    detail.is_correct ? "correct" : "incorrect"
                                                }`}
                                            >
                                                <h4>
                                                    {index + 1}.{" "}
                                                    {question?.question_text || `Question ${index + 1}`}
                                                </h4>

                                                <p>
                                                    Your answer:{" "}
                                                    <strong>{detail.student_answer ?? "Not answered"}</strong>
                                                </p>

                                                {!detail.is_correct && (
                                                    <p>
                                                        Correct answer:{" "}
                                                        <strong>{detail.correct_answer}</strong>
                                                    </p>
                                                )}

                                                <p>
                                                    {detail.is_correct
                                                        ? "Correct answer"
                                                        : "Incorrect answer"}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p>
                                    {sheetResult.submission?.is_late
                                        ? "Submitted late"
                                        : "Submitted on time"}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitSheet}>
                                <div className="questions-list">
                                    {(selectedLesson.sheet?.questions ?? []).map(
                                        (question, index) => {
                                            let options = question.options;

                                            if (typeof options === "string") {
                                                try {
                                                    options = JSON.parse(options);
                                                } catch {
                                                    options = {};
                                                }
                                            }

                                            const normalizedOptions = Array.isArray(options)
                                                ? options.map((option, i) => [
                                                    String(i),
                                                    typeof option === "object" &&
                                                    option !== null
                                                        ? option.text ??
                                                        option.label ??
                                                        JSON.stringify(option)
                                                        : option,
                                                ])
                                                : Object.entries(options ?? {});

                                            return (
                                                <article
                                                    className="question-card"
                                                    key={question.id}
                                                >
                                                    <h4>
                                                        {index + 1}. {question.question_text}
                                                    </h4>

                                                    {normalizedOptions.map(([key, value]) => {
                                                        const optionValue = String(value);

                                                        return (
                                                            <label
                                                                className="question-option"
                                                                key={key}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question.id}`}
                                                                    value={optionValue}
                                                                    checked={
                                                                        answers[question.id] ===
                                                                        optionValue
                                                                    }
                                                                    onChange={() =>
                                                                        setAnswers((previous) => ({
                                                                            ...previous,
                                                                            [question.id]:
                                                                            optionValue,
                                                                        }))
                                                                    }
                                                                />

                                                                <span className="option-label">
                                                    {key}
                                                </span>

                                                                <span>{optionValue}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </article>
                                            );
                                        }
                                    )}
                                </div>

                                {sheetSubmitError && (
                                    <div className="error-state">
                                        {sheetSubmitError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        sheetSubmitting ||
                                        (selectedLesson.sheet?.questions ?? []).length === 0
                                    }
                                >
                                    {sheetSubmitting ? "Submitting..." : "Submit Sheet"}
                                </button>
                            </form>
                        )}
                    </>
                )}



                {activeTab === "exam" && (
                    <>
                        <h2>{selectedLesson.exam?.title || "Exam"}</h2>

                        {examResult ? (
                            <div className="exam-result">

                                <h3>Exam Submitted Successfully!</h3>

                                <p>
                                    Score: {examResult.grade_details?.score ??
                                    examResult.submission?.score ?? 0}
                                </p>

                                <p>
                                    Correct Answers: {
                                    examResult.grade_details?.correct_count ?? 0
                                } / {
                                    examResult.grade_details?.total_questions ?? 0
                                }
                                </p>

                                <div className="exam-review">
                                    <h3>Review Your Answers</h3>

                                    {examResult.grade_details?.details?.map((detail, index) => {
                                        const question = selectedLesson.exam?.questions?.find(
                                            (item) => item.id === detail.question_id
                                        );

                                        return (
                                            <div
                                                key={detail.question_id}
                                                className={`exam-review-question ${
                                                    detail.is_correct ? "correct" : "incorrect"
                                                }`}
                                            >
                                                <h4>
                                                    {index + 1}. {question?.question_text || `Question ${index + 1}`}
                                                </h4>

                                                <p>
                                                    Your answer:{" "}
                                                    <strong>{detail.student_answer ?? "Not answered"}</strong>
                                                </p>

                                                {!detail.is_correct && (
                                                    <p>
                                                        Correct answer:{" "}
                                                        <strong>{detail.correct_answer}</strong>
                                                    </p>
                                                )}

                                                <p>
                                                    {detail.is_correct
                                                        ? "Correct answer"
                                                        : "Incorrect answer"}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p>
                                    Attempt Number: {
                                    examResult.submission?.attempt_number ?? "-"
                                }
                                </p>

                                <p>
                                    {examResult.submission?.is_late
                                        ? "Submitted late"
                                        : "Submitted on time"}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitExam}>
                                {renderQuestions(selectedLesson.exam?.questions)}

                                {examSubmitError && (
                                    <div className="error-state">
                                        {examSubmitError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        examSubmitting ||
                                        (selectedLesson.exam?.questions ?? []).length === 0
                                    }
                                >
                                    {examSubmitting
                                        ? "Submitting..."
                                        : "Submit Exam"}
                                </button>
                            </form>
                        )}
                    </>
                )}

            </section>
        </main>
    );
}

export default StudentLessonDetails;
