import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../assets/css/auth/Login.css";
import Input from "../../components/forms/Input.jsx";
import { login } from "../../features/auth/authSlice.js";
import {
    emailValidation,
    passwordValidation,
} from "../../validation/registerValidation.js";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    async function onHandleSubmit(data) {
        try {
            const response = await dispatch(login(data)).unwrap();
            const user = response.user;

            if (user.role === "teacher") {
                navigate("/teacher/dashboard", { replace: true });
            } else if (user.role === "student") {
                navigate("/dashboard", { replace: true });
            } else if (user.role === "parent") {
                navigate("/parent/dashboard", { replace: true });
            } else {
                console.error("Unknown user role:", user.role);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    }


    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-brand">
                    <div className="login-brand-icon">
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

                <div className="login-heading">
                    <h1>Welcome back!</h1>
                    <p>
                        Sign in to your account and continue your learning
                        journey.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit(onHandleSubmit)}
                >
                    <Input
                        label="Email address"
                        type="email"
                        name="email"
                        register={register}
                        error={errors.email}
                        rules={emailValidation}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        register={register}
                        error={errors.password}
                        rules={passwordValidation}
                    />

                    {error && (
                        <div className="login-error" role="alert">
                            <span className="login-error-icon">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        className="login-submit"
                        type="submit"
                        disabled={loading}
                    >
                    <span>
                        {loading ? "Signing you in..." : "Sign in"}
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

                <div className="login-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register">Create account</Link>
                </div>

                <p className="login-copyright">
                    © {new Date().getFullYear()} EduFlow. All rights reserved.
                </p>
            </section>
        </main>
    );

}

export default Login;