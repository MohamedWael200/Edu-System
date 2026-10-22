import Input from "../../components/forms/Input.jsx";
import { useForm } from "react-hook-form";
import "../../assets/css/TeacherCreateLesson.css";
import {
    publishedAtValidation,
    titleValidation,
    videoDurationValidation,
    videoTitleValidation,
    videoFileValidation,
    sheetTitleValidation,
    sheetDeadlineHoursValidation,
    sheetFileValidation,
    examFileValidation
} from "../../validation/LessonValidation.js";
import { useDispatch, useSelector } from "react-redux";
import { createLesson } from "../../features/teacher/teacherSlice.js";

function TeacherCreateLesson() {
    const dispatch = useDispatch();

    const { createdLesson, createLoading, createError } = useSelector(
        (state) => state.teacher
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    // Video
    const videoTitle = watch("video.title");
    const videoFile = watch("video.file");
    const videoDuration = watch("video.duration");

    const hasVideoData =
        videoTitle || videoFile?.length > 0 || videoDuration;

    const videoTitleRules = {
        ...videoTitleValidation,
    };

    const videoFileRules = {
        ...videoFileValidation,
    };

    const videoDurationRules = {
        ...videoDurationValidation,
    };

    if (hasVideoData) {
        videoTitleRules.required = "Video title is required";
        videoFileRules.required = "Video file is required";
        videoDurationRules.required = "Video duration is required";
    }

    // Sheet
    const sheetTitle = watch("sheet.title");
    const sheetDeadlineHours = watch("sheet.deadline_hours");
    const sheetFile = watch("sheet.file");

    const hasSheetData =
        sheetTitle ||
        sheetDeadlineHours ||
        sheetFile?.length > 0;

    const sheetTitleRules = {
        ...sheetTitleValidation,
    };

    const sheetDeadlineHoursRules = {
        ...sheetDeadlineHoursValidation,
    };

    const sheetFileRules = {
        ...sheetFileValidation,
    };

    if (hasSheetData) {
        sheetTitleRules.required = "Sheet title is required";
        sheetDeadlineHoursRules.required =
            "Sheet deadline hours is required";
        sheetFileRules.required = "Sheet file is required";
    }


    // Exam
    const examFile = watch("exam.file");

    const examFileRules = {
        ...examFileValidation,
    };


    function onSubmit(data) {
        const formData = new FormData();

        formData.append("title", data.title);

        if (data.published_at) {
            formData.append(
                "published_at",
                data.published_at.replace("T", " ") + ":00"
            );
        }

        // Video
        if (
            data.video?.title ||
            data.video?.file?.length ||
            data.video?.duration
        ) {
            formData.append(
                "video[title]",
                data.video.title
            );

            formData.append(
                "video[file]",
                data.video.file[0]
            );

            formData.append(
                "video[duration]",
                Number(data.video.duration)
            );
        }

        // Sheet
        if (
            data.sheet?.title ||
            data.sheet?.deadline_hours ||
            data.sheet?.file?.length
        ) {
            formData.append(
                "sheet[title]",
                data.sheet.title
            );

            formData.append(
                "sheet[deadline_hours]",
                Number(data.sheet.deadline_hours)
            );

            formData.append(
                "sheet[file]",
                data.sheet.file[0]
            );
        }


        // Exam
        if (data.exam?.file?.length > 0) {
            formData.append(
                "exam[file]",
                data.exam.file[0]
            );
        }

        dispatch(createLesson(formData));
    }


    return (
        <div className="create-lesson-page">
            <header className="create-lesson-header">
                <div>
                    <h1>Create New Lesson</h1>
                    <p>
                        Organize your lesson and add learning materials
                        for your students.
                    </p>
                </div>

                <span className="create-lesson-badge">
                New Lesson
            </span>
            </header>

            <form
                className="create-lesson-form"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Lesson Information */}
                <section className="create-lesson-section">
                    <div className="create-lesson-section-header">
                        <div className="create-lesson-section-icon">
                            ◈
                        </div>

                        <div>
                            <h2>Lesson Information</h2>
                            <p>
                                Set the lesson title and publication date.
                            </p>
                        </div>
                    </div>

                    <div className="create-lesson-fields">
                        <div className="create-lesson-field-full">
                            <Input
                                label="Lesson Title"
                                type="text"
                                name="title"
                                register={register}
                                error={errors.title}
                                rules={titleValidation}
                            />
                        </div>

                        <div className="create-lesson-field-full">
                            <Input
                                label="Published At"
                                type="datetime-local"
                                name="published_at"
                                register={register}
                                error={errors.published_at}
                                rules={publishedAtValidation}
                            />
                        </div>
                    </div>
                </section>

                {/* Video */}
                <section className="create-lesson-section">
                    <div className="create-lesson-section-header">
                        <div className="create-lesson-section-icon">
                            ▶
                        </div>

                        <div>
                            <h2>Video Lesson</h2>
                            <p>
                                Add a video for students to watch.
                                This section is optional.
                            </p>
                        </div>
                    </div>

                    <div className="create-lesson-fields">
                        <div>
                            <Input
                                label="Video Title"
                                type="text"
                                name="video.title"
                                register={register}
                                error={errors.video?.title}
                                rules={videoTitleRules}
                            />
                        </div>

                        <div>
                            <Input
                                label="Video Duration (seconds)"
                                type="number"
                                name="video.duration"
                                register={register}
                                error={errors.video?.duration}
                                rules={videoDurationRules}
                            />
                        </div>

                        <div className="create-lesson-field-full">
                            <Input
                                label="Video File"
                                type="file"
                                name="video.file"
                                register={register}
                                error={errors.video?.file}
                                rules={videoFileRules}
                            />

                            {videoFile?.[0] && (
                                <div className="create-lesson-file-info">
                                    <strong>
                                        {videoFile[0].name}
                                    </strong>

                                    <span>
                                    Size:{" "}
                                        {(
                                            videoFile[0].size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Sheet */}
                <section className="create-lesson-section">
                    <div className="create-lesson-section-header">
                        <div className="create-lesson-section-icon">
                            ▤
                        </div>

                        <div>
                            <h2>Practice Sheet</h2>
                            <p>
                                Upload a Word file containing the
                                practice questions.
                                This section is optional.
                            </p>
                        </div>
                    </div>

                    <div className="create-lesson-fields">
                        <div>
                            <Input
                                label="Sheet Title"
                                type="text"
                                name="sheet.title"
                                register={register}
                                error={errors.sheet?.title}
                                rules={sheetTitleRules}
                            />
                        </div>

                        <div>
                            <Input
                                label="Deadline (hours)"
                                type="number"
                                name="sheet.deadline_hours"
                                register={register}
                                error={errors.sheet?.deadline_hours}
                                rules={sheetDeadlineHoursRules}
                            />
                        </div>

                        <div className="create-lesson-field-full">
                            <Input
                                label="Sheet Word File"
                                type="file"
                                name="sheet.file"
                                register={register}
                                error={errors.sheet?.file}
                                rules={sheetFileRules}
                            />

                            {sheetFile?.[0] && (
                                <div className="create-lesson-file-info">
                                    <strong>
                                        {sheetFile[0].name}
                                    </strong>

                                    <span>
                                    Size:{" "}
                                        {(
                                            sheetFile[0].size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Exam */}
                <section className="create-lesson-section">
                    <div className="create-lesson-section-header">
                        <div className="create-lesson-section-icon">
                            ✓
                        </div>

                        <div>
                            <h2>Lesson Exam</h2>
                            <p>
                                Add an exam with questions and answers
                                using the provided Word template.
                                This section is optional.
                            </p>
                        </div>
                    </div>

                    <div className="create-lesson-help">
                        Download the Exam Word template, fill in the
                        exam details and questions, then upload the
                        completed file.
                    </div>

                    <div className="create-lesson-fields">
                        <div className="create-lesson-field-full">
                            <Input
                                label="Exam Word File"
                                type="file"
                                name="exam.file"
                                register={register}
                                error={errors.exam?.file}
                                rules={examFileRules}
                            />

                            {examFile?.[0] && (
                                <div className="create-lesson-file-info">
                                    <strong>
                                        {examFile[0].name}
                                    </strong>

                                    <span>
                                    Size:{" "}
                                        {(
                                            examFile[0].size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Feedback */}
                {createError && (
                    <div className="create-lesson-error" role="alert">
                        {createError}
                    </div>
                )}

                {/* Submit */}
                <div className="create-lesson-actions">
                    <button
                        className="create-lesson-submit"
                        type="submit"
                        disabled={createLoading}
                    >
                        {createLoading
                            ? "Creating Lesson..."
                            : "Create Lesson"}
                    </button>
                </div>
            </form>


            {createError && (
                <div className="create-lesson-error" role="alert">
                    <strong>Creation Failed!</strong>
                    <p>{createError}</p>
                </div>
            )}

            {createdLesson && (
                <div className="create-lesson-success" role="status">
                    <strong>Lesson Created Successfully!</strong>
                    <p>
                        Your lesson "{createdLesson.title}" has been created successfully.
                    </p>
                </div>
            )}

        </div>
    );

}

export default TeacherCreateLesson;