
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { getTeacherDetails } from "../../features/marketplace/marketplaceTeacherSlice.js";
import {
    enrollWithTeacher,
    getStudentEnrollments,
    clearEnrollError,
} from "../../features/student/studentEnrollmentSlice.js";

function MarketplaceTeacherDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [enrollSuccess, setEnrollSuccess] = useState("");

    const {
        teacherDetails,
        detailsLoading,
        detailsError,
    } = useSelector((state) => state.marketplace);

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const {
        enrollments,
        loading: enrollmentsLoading,
        enrollLoading,
        enrollError,
    } = useSelector((state) => state.studentEnrollments);

    const isStudent = isAuthenticated && user?.role === "student";

    useEffect(() => {
        dispatch(getTeacherDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (isStudent) {
            dispatch(getStudentEnrollments());
        }
    }, [dispatch, isStudent]);

    const isEnrolled = enrollments.some((enrollment) => {
        const enrolledTeacherId =
            enrollment.teacher_id ??
            enrollment.teacher?.id ??
            enrollment.teacher?.user_id;

        return String(enrolledTeacherId) === String(id);
    });

    const handleEnroll = async () => {
        setEnrollSuccess("");
        dispatch(clearEnrollError());

        try {
            await dispatch(enrollWithTeacher(Number(id))).unwrap();

            setEnrollSuccess("You have successfully enrolled with this teacher.");

            // Refresh the student's enrollments after success.
            dispatch(getStudentEnrollments());
        } catch {
            // The error message is stored in Redux as enrollError.
        }
    };

    if (detailsLoading) {
        return (
            <main className="marketplace-page">
                <p>Loading teacher profile...</p>
            </main>
        );
    }

    if (detailsError) {
        return (
            <main className="marketplace-page">
                <h2>Unable to load teacher profile</h2>
                <p>{detailsError}</p>
                <Link to="/marketplace/teachers">Back to teachers</Link>
            </main>
        );
    }

    if (!teacherDetails || String(teacherDetails.id) !== String(id)) {
        return (
            <main className="marketplace-page">
                <p>Teacher profile not found.</p>
                <Link to="/marketplace/teachers">Back to teachers</Link>
            </main>
        );
    }

    const profile = teacherDetails.teacher_profile || {};
    const lessons = teacherDetails.lessons || [];

    const initials = (teacherDetails.name || "T")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    return (
        <main className="marketplace-page teacher-details-page">
            <Link
                to="/marketplace/teachers"
                className="teacher-details-back"
            >
                ← Back to teachers
            </Link>

            <section className="teacher-details-hero">
                <div className="teacher-details-avatar">{initials}</div>

                <div className="teacher-details-intro">
                    <span className="marketplace-eyebrow">
                        TEACHER PROFILE
                    </span>

                    <h1>{teacherDetails.name}</h1>

                    <p>{profile.subject || "Subject not specified"}</p>

                    <span className="teacher-details-stage">
                        {profile.subject_stage || "Stage not specified"}
                    </span>

                    {isStudent && (
                        <div className="teacher-enrollment-action">
                            {isEnrolled ? (
                                <button
                                    type="button"
                                    className="teacher-enroll-button"
                                    disabled
                                >
                                    Already enrolled
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="teacher-enroll-button"
                                    onClick={handleEnroll}
                                    disabled={enrollLoading || enrollmentsLoading}
                                >
                                    {enrollLoading
                                        ? "Enrolling..."
                                        : "Enroll with this teacher"}
                                </button>
                            )}

                            {enrollSuccess && (
                                <p className="teacher-enrollment-success" role="status">
                                    {enrollSuccess}
                                </p>
                            )}

                            {enrollError && (
                                <p className="teacher-enrollment-error" role="alert">
                                    {enrollError}
                                </p>
                            )}
                        </div>
                    )}

                    {!isAuthenticated && (
                        <p>
                            <Link to="/login">
                                Log in as a student to enroll with this teacher.
                            </Link>
                        </p>
                    )}
                </div>
            </section>

            <section className="teacher-details-section">
                <h2>About the teacher</h2>

                <p>{profile.bio || "No biography available yet."}</p>

                <div className="teacher-details-info-grid">
                    <div className="teacher-details-info">
                        <span>Email</span>
                        <strong>
                            {teacherDetails.email || "Not provided"}
                        </strong>
                    </div>

                    <div className="teacher-details-info">
                        <span>Phone</span>
                        <strong>
                            {teacherDetails.phone || "Not provided"}
                        </strong>
                    </div>

                    <div className="teacher-details-info">
                        <span>Published lessons</span>
                        <strong>{lessons.length}</strong>
                    </div>
                </div>
            </section>

            <section className="teacher-details-section">
                <div className="teacher-lessons-heading">
                    <div>
                        <span className="marketplace-eyebrow">
                            LEARNING CONTENT
                        </span>

                        <h2>Teacher's lessons</h2>
                    </div>

                    <span className="teacher-lessons-count">
                        {lessons.length} lessons
                    </span>
                </div>

                {lessons.length === 0 ? (
                    <p className="teacher-lessons-empty">
                        No lessons available yet.
                    </p>
                ) : (
                    <div className="teacher-details-lessons">
                        {lessons.map((lesson) => (
                            <article
                                className="teacher-details-lesson"
                                key={lesson.id}
                            >
                                <div className="teacher-lesson-icon">▤</div>

                                <div className="teacher-lesson-info">
                                    <h3>{lesson.title}</h3>

                                    <p>
                                        Published:{" "}
                                        {lesson.published_at
                                            ? new Date(
                                                  lesson.published_at
                                              ).toLocaleDateString()
                                            : "Not scheduled"}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default MarketplaceTeacherDetails;