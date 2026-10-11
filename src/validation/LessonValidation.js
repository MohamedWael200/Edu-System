export const titleValidation = {
    required: "Title is required",
    minLength: {
        value: 3,
        message: "Title must be at least 3 characters",
    },
    maxLength: {
        value: 255,
        message: "Title must not exceed 255 characters",
    },
};

export const publishedAtValidation = {
    required: "Published At is required",
};

export const videoTitleValidation = {
    maxLength: {
        value: 255,
        message: "Video title must not exceed 255 characters",
    },
};

export const videoFilePathValidation = {
    maxLength: {
        value: 255,
        message: "Video file path must not exceed 255 characters",
    },
};

export const videoDurationValidation = {
    min: {
        value: 1,
        message: "Duration must be greater than 0",
    },
};
export const videoFileValidation = {
    validate: (value) => {
        if (!value?.[0]) {
            return "Video file is required";
        }

        const file = value[0];

        const allowedTypes = [
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
            "video/webm",
        ];

        if (!allowedTypes.includes(file.type)) {
            return "Invalid video format";
        }

        if (file.size > 500 * 1024 * 1024) {
            return "Video must be less than 500MB";
        }

        return true;
    },
};

export const sheetTitleValidation = {
    maxLength: {
        value: 255,
        message: "Sheet title must not exceed 255 characters",
    },
};

export const sheetDeadlineHoursValidation = {
    min: {
        value: 1,
        message: "Deadline hours must be greater than 0",
    },
};

export const sheetFileValidation = {
    validate: (files) => {
        if (!files?.[0]) {
            return "Sheet file is required";
        }

        if (
            files[0].type !==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            return "Only Word (.docx) files are allowed";
        }

        return true;
    },
};