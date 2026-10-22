import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../features/auth/authSlice.js";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/forms/Input.jsx";
import { useNavigate } from "react-router-dom";
import "../../assets/css/auth/Register.css";
import { Link } from "react-router-dom";
import {
    nameValidation,
    emailValidation,
    phoneValidation,
    passwordValidation,
    subjectValidation,
    subjectStageValidation,
    bioValidation,
} from "../../validation/registerValidation.js";
import {useState} from "react";

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.auth);
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "teacher",
            subject: "",
            bio: "",
            subject_stage: "",
        },
    });
    const selectedRole = watch("role");


    const onSubmit = async (data) => {
        setSuccessMessage("");

        const { subject, bio, subject_stage, ...basicData } = data;

        const registrationData =
            data.role === "teacher"
                ? data
                : basicData;

        try {
            const result = await dispatch(
                registerUser(registrationData)
            ).unwrap();

            setSuccessMessage(result.message);

            const dashboardByRole = {
                teacher: "/teacher/dashboard",
                student: "/dashboard",
            };

            navigate(
                dashboardByRole[data.role] || "/login",
                { replace: true }
            );
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };



    return (
        <main className="register-page">
            <section className="register-card">
                <div className="register-brand">
                    <div className="register-brand-icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M3 10.5 12 4l9 6.5" />
                            <path d="M5.5 9.5V20h13V9.5" />
                            <path d="M9 20v-6h6v6" />
                        </svg>
                    </div>
                    <span>EduFlow</span>
                </div>

                <div className="register-heading">
                    <h1>Create your account</h1>
                    <p>
                        Join EduFlow and start your educational journey.
                    </p>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="register-section-title">
                        <span className="register-step">1</span>
                        <div>
                            <h2>Personal information</h2>
                            <p>Enter your account details.</p>
                        </div>
                    </div>

                    <div className="register-fields">
                        <Input
                            register={register}
                            name="name"
                            label="Full Name"
                            error={errors.name}
                            rules={nameValidation}
                        />

                        <Input
                            register={register}
                            name="email"
                            label="Email Address"
                            type="email"
                            error={errors.email}
                            rules={emailValidation}
                        />

                        <Input
                            register={register}
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            error={errors.phone}
                            rules={phoneValidation}
                        />

                        <Input
                            register={register}
                            name="password"
                            label="Password"
                            type="password"
                            error={errors.password}
                            rules={passwordValidation}
                        />

                        <div className="form-input-group">
                            <label
                                className="form-input-label"
                                htmlFor="role"
                            >
                                Account Type
                            </label>

                            <Controller
                                name="role"
                                control={control}
                                rules={{
                                    required: "Account type is required",
                                }}
                                render={({ field }) => (
                                    <select
                                        id="role"
                                        className={`form-input ${
                                            errors.role
                                                ? "form-input-invalid"
                                                : ""
                                        }`}
                                        {...field}
                                    >
                                        <option value="teacher">
                                            Teacher
                                        </option>
                                        <option value="student">
                                            Student
                                        </option>
                                        <option value="parent">
                                            Parent
                                        </option>
                                    </select>
                                )}
                            />

                            {errors.role?.message && (
                                <p className="form-input-error" role="alert">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {selectedRole === "teacher" && (
                        <div className="register-teacher-section">
                            <div className="register-section-title">
                                <span className="register-step">2</span>
                                <div>
                                    <h2>Teaching information</h2>
                                    <p>
                                        Tell us about your subject and
                                        teaching experience.
                                    </p>
                                </div>
                            </div>

                            <div className="register-fields">
                                <div className="form-input-group">
                                    <label
                                        className="form-input-label"
                                        htmlFor="subject"
                                    >
                                        Subject
                                    </label>

                                    <Controller
                                        name="subject"
                                        control={control}
                                        rules={subjectValidation}
                                        render={({ field }) => (
                                            <select
                                                id="subject"
                                                className={`form-input ${
                                                    errors.subject
                                                        ? "form-input-invalid"
                                                        : ""
                                                }`}
                                                {...field}
                                            >
                                                <option value="">
                                                    Select a subject
                                                </option>
                                                <option value="Arabic">Arabic</option>
                                                <option value="English">English</option>
                                                <option value="French">French</option>
                                                <option value="German">German</option>
                                                <option value="Mathematics">
                                                    Mathematics
                                                </option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">
                                                    Chemistry
                                                </option>
                                                <option value="Biology">Biology</option>
                                                <option value="Geology">Geology</option>
                                                <option value="History">History</option>
                                                <option value="Geography">
                                                    Geography
                                                </option>
                                                <option value="Philosophy">
                                                    Philosophy
                                                </option>
                                                <option value="Psychology">
                                                    Psychology
                                                </option>
                                                <option value="Sociology">
                                                    Sociology
                                                </option>
                                                <option value="Economics">
                                                    Economics
                                                </option>
                                                <option value="Statistics">
                                                    Statistics
                                                </option>
                                                <option value="Computer Science">
                                                    Computer Science
                                                </option>
                                            </select>
                                        )}
                                    />

                                    {errors.subject?.message && (
                                        <p
                                            className="form-input-error"
                                            role="alert"
                                        >
                                            {errors.subject.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-input-group">
                                    <label
                                        className="form-input-label"
                                        htmlFor="subject_stage"
                                    >
                                        Subject Stage
                                    </label>

                                    <Controller
                                        name="subject_stage"
                                        control={control}
                                        rules={subjectStageValidation}
                                        render={({ field }) => (
                                            <select
                                                id="subject_stage"
                                                className={`form-input ${
                                                    errors.subject_stage
                                                        ? "form-input-invalid"
                                                        : ""
                                                }`}
                                                {...field}
                                            >
                                                <option value="">
                                                    Select a school stage
                                                </option>

                                                <optgroup label="Primary">
                                                    <option value="Primary 1">Primary 1</option>
                                                    <option value="Primary 2">Primary 2</option>
                                                    <option value="Primary 3">Primary 3</option>
                                                    <option value="Primary 4">Primary 4</option>
                                                    <option value="Primary 5">Primary 5</option>
                                                    <option value="Primary 6">Primary 6</option>
                                                </optgroup>

                                                <optgroup label="Preparatory">
                                                    <option value="Preparatory 1">Preparatory 1</option>
                                                    <option value="Preparatory 2">Preparatory 2</option>
                                                    <option value="Preparatory 3">Preparatory 3</option>
                                                </optgroup>

                                                <optgroup label="Secondary">
                                                    <option value="Secondary 1">Secondary 1</option>
                                                    <option value="Secondary 2">Secondary 2</option>
                                                    <option value="Secondary 3">Secondary 3</option>
                                                </optgroup>
                                            </select>
                                        )}
                                    />

                                    {errors.subject_stage?.message && (
                                        <p
                                            className="form-input-error"
                                            role="alert"
                                        >
                                            {errors.subject_stage.message}
                                        </p>
                                    )}
                                </div>

                                <Input
                                    register={register}
                                    name="bio"
                                    label="About You"
                                    error={errors.bio}
                                    rules={bioValidation}
                                />
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <p
                            className="register-success-message"
                            role="status"
                        >
                            {successMessage}
                        </p>
                    )}

                    {error && (
                        <p className="form-input-error register-api-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="register-submit"
                        type="submit"
                        disabled={loading}
                    >
                    <span>
                        {loading ? "Creating Account..." : "Create Account"}
                    </span>

                        {!loading && (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign in</Link>
                </div>

                <p className="register-copyright">
                    © {new Date().getFullYear()} EduFlow. All rights reserved.
                </p>
            </section>
        </main>
    );

}

export default Register;
