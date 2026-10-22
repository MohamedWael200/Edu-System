
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLinkedStudents } from "../../features/parent/parentSlice";
import "../../assets/css/parent/LinkedStudents.css";

function LinkedStudents() {
    const dispatch = useDispatch();

    const {
        linkedStudents,
        studentsLoading,
        studentsError,
    } = useSelector((state) => state.parent);

    useEffect(() => {
        dispatch(getLinkedStudents());
    }, [dispatch]);

    if (studentsLoading) {
        return (
            <div className="linked-students">
                <div className="linked-students__state">
                    <span className="linked-students__spinner" />
                    <p>Loading your students...</p>
                </div>
            </div>
        );
    }

    if (studentsError) {
        return (
            <div className="linked-students">
                <div className="linked-students__state linked-students__state--error">
                    <h2>Unable to load students</h2>
                    <p>{studentsError}</p>
                    <button
                        className="linked-students__retry"
                        onClick={() => dispatch(getLinkedStudents())}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="linked-students">
            <header className="linked-students__header">
                <div>
                    <p className="linked-students__eyebrow">
                        PARENT DASHBOARD
                    </p>
                    <h1>My Students</h1>
                    <p className="linked-students__subtitle">
                        View your linked students and track their academic progress.
                    </p>
                </div>

                <span className="linked-students__count">
                    {linkedStudents.length}
                </span>
            </header>

            {linkedStudents.length === 0 ? (
                <div className="linked-students__state">
                    <div className="linked-students__state-icon">♧</div>
                    <h2>No linked students yet</h2>
                    <p>
                        Once a student is linked to your account, their information
                        will appear here.
                    </p>
                </div>
            ) : (
                <section className="linked-students__grid">
                    {linkedStudents.map((student) => (
                        <article
                            className="linked-students__card"
                            key={student.id}
                        >
                            <div className="linked-students__card-top">
                                <div className="linked-students__avatar">
                                    {student.name?.trim().charAt(0) || "S"}
                                </div>

                                <div className="linked-students__identity">
                                    <h3>{student.name}</h3>
                                    <span>Linked Student</span>
                                </div>
                            </div>

                            <div className="linked-students__details">
                                <div className="linked-students__detail">
                                    <span className="linked-students__detail-icon">
                                        @
                                    </span>
                                    <div className="linked-students__detail-text">
                                        <small>Email address</small>
                                        <span>{student.email || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="linked-students__detail">
                                    <span className="linked-students__detail-icon">
                                        ☎
                                    </span>
                                    <div className="linked-students__detail-text">
                                        <small>Phone number</small>
                                        <span>{student.phone || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                className="linked-students__view-link"
                                to={`/parent/children/${student.id}`}
                            >
                                View Academic Overview
                                <span aria-hidden="true">→</span>
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default LinkedStudents;
