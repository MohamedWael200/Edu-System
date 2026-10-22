
export const nameValidation = {
    required: "Name is required",
    minLength: {
        value: 3,
        message: "Name must be at least 3 characters",
    },
};

export const emailValidation = {
    required: "Email is required",
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
    },
};

export const phoneValidation = {
    required: "Phone number is required",
    pattern: {
        value: /^01[0125]\d{8}$/,
        message: "Enter a valid Egyptian mobile number",
    },
};

export const passwordValidation = {
    required: "Password is required",
    minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
    },
};

export const subjectValidation = {
    required: "Subject is required",
};

export const subjectStageValidation = {
    required: "Subject stage is required",
};

export const bioValidation = {
    required: "Bio is required",
};
