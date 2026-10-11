import Input from "../../components/forms/Input.jsx";
import { useForm } from "react-hook-form";
import {
    publishedAtValidation,
    titleValidation,
    videoDurationValidation,
    videoTitleValidation,
    videoFileValidation,
    sheetTitleValidation,
    sheetDeadlineHoursValidation,
    sheetFileValidation
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

        dispatch(createLesson(formData));
    }

    return (
        <>
            <h1>TeacherCreateLesson</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Input
                    label="Title"
                    type="text"
                    name="title"
                    register={register}
                    error={errors.title}
                    rules={titleValidation}
                />

                <Input
                    label="Published At"
                    type="datetime-local"
                    name="published_at"
                    register={register}
                    error={errors.published_at}
                    rules={publishedAtValidation}
                />

                {/* Video */}

                <h2>Video</h2>

                <Input
                    label="Video Title"
                    type="text"
                    name="video.title"
                    register={register}
                    error={errors.video?.title}
                    rules={videoTitleRules}
                />

                <Input
                    label="Video File"
                    type="file"
                    name="video.file"
                    register={register}
                    error={errors.video?.file}
                    rules={videoFileRules}
                />

                {videoFile?.[0] && (
                    <div>
                        <p>
                            Selected video: {videoFile[0].name}
                        </p>

                        <p>
                            Size:{" "}
                            {(videoFile[0].size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                )}

                <Input
                    label="Video Duration"
                    type="number"
                    name="video.duration"
                    register={register}
                    error={errors.video?.duration}
                    rules={videoDurationRules}
                />

                {/* Sheet */}

                <h2>Sheet</h2>

                <Input
                    label="Sheet Title"
                    type="text"
                    name="sheet.title"
                    register={register}
                    error={errors.sheet?.title}
                    rules={sheetTitleRules}
                />

                <Input
                    label="Deadline Hours"
                    type="number"
                    name="sheet.deadline_hours"
                    register={register}
                    error={errors.sheet?.deadline_hours}
                    rules={sheetDeadlineHoursRules}
                />

                <Input
                    label="Sheet File"
                    type="file"
                    name="sheet.file"
                    register={register}
                    error={errors.sheet?.file}
                    rules={sheetFileRules}
                />

                {sheetFile?.[0] && (
                    <div>
                        <p>
                            Selected sheet: {sheetFile[0].name}
                        </p>

                        <p>
                            Size:{" "}
                            {(sheetFile[0].size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={createLoading}
                >
                    {createLoading ? "Creating..." : "Create Lesson"}
                </button>

                {createError && <p>{createError}</p>}
            </form>

            {createdLesson && (
                <div>
                    <h2>Lesson Created</h2>
                    <p>{createdLesson.title}</p>
                    <p>{createdLesson.published_at}</p>
                </div>
            )}
        </>
    );
}

export default TeacherCreateLesson;