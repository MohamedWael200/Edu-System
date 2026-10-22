import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getTeacherStudent,
  unblockStudent,
} from "../../features/teacher/teacherStudentSlice.js";
import "../../assets/css/teacherStudent/TeacherStudents.css";

function TeacherStudents() {
  const dispatch = useDispatch();
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const {
    students,
    loading,
    error,
    unblockLoading,
    unblockError,
    unblockSuccess,
  } = useSelector((state) => state.teacherStudent);

  useEffect(() => {
    dispatch(getTeacherStudent());
  }, [dispatch]);

  const handleUnblock = async () => {
    if (!selectedEnrollment) return;

    try {
      await dispatch(
        unblockStudent(selectedEnrollment.id)
      ).unwrap();

      setSelectedEnrollment(null);
    } catch {
      // رسالة الخطأ موجودة في Redux state
    }
  };

  if (loading) {
    return (
      <div className="students-state">
        <div className="students-spinner" />
        <p>Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-state students-error">
        <h2>Unable to load students</h2>
        <p>{error}</p>
        <button
          className="students-btn students-btn-primary"
          onClick={() => dispatch(getTeacherStudent())}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="teacher-students-page">
      <header className="students-header">
        <div>
          <span className="students-eyebrow">EDUFLOW / MANAGEMENT</span>
          <h1>My Students</h1>
          <p>Manage your students and review their violations.</p>
        </div>

        <div className="students-total">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
      </header>

      {unblockSuccess && (
        <div className="students-alert students-alert-success" role="status">
          <span>✓</span>
          {unblockSuccess}
        </div>
      )}

      {unblockError && (
        <div className="students-alert students-alert-error" role="alert">
          {unblockError}
        </div>
      )}

      {students.length === 0 ? (
        <div className="students-empty">
          <div className="students-empty-icon">♧</div>
          <h2>No students yet</h2>
          <p>
            Students enrolled with you will appear here.
          </p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((enrollment) => {
            const isBlocked = enrollment.status === "blocked";
            const violations = enrollment.violations ?? [];

            return (
              <article className="student-card" key={enrollment.id}>
                <div className="student-card-header">
                  <div className="student-avatar">
                    {(enrollment.student?.name || "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span
                    className={`student-status ${
    isBlocked ? "status-blocked" : "status-active"
}`}
                  >
                    {enrollment.status || "Unknown"}
                  </span>
                </div>

                <div className="student-info">
                  <h2>
                    {enrollment.student?.name || "Unknown Student"}
                  </h2>

                  <p className="student-email">
                    {enrollment.student?.email || "No email provided"}
                  </p>

                  <p className="student-id">
                    Student ID: {enrollment.student_id}
                  </p>
                </div>

                <div className="student-stats">
                  <div className="student-stat">
                    <span>Enrollment ID</span>
                    <strong>{enrollment.id}</strong>
                  </div>

                  <div className="student-stat">
                    <span>Violations</span>
                    <strong>{enrollment.violations_count ?? 0}</strong>
                  </div>
                </div>

                <div className="student-violations">
                  <h3>
                    Violations
                    <span>{violations.length}</span>
                  </h3>

                  {violations.length === 0 ? (
                    <p className="no-violations">
                      No violations recorded.
                    </p>
                  ) : (
                    <div className="violations-list">
                      {violations.map((violation) => (
                        <div
                          className="violation-item"
                          key={violation.id}
                        >
                          <div>
                            <strong>
                              {(violation.type || "Violation")
                                .replaceAll("_", " ")}
                            </strong>
                            <p>
                              Reference: {violation.reference_id ?? "—"}
                            </p>
                          </div>

                          <time>
                            {violation.created_at
                              ? new Date(
                                  violation.created_at
                                ).toLocaleDateString()
                              : "—"}
                          </time>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isBlocked && (
                  <button
                    className="students-btn students-btn-unblock"
                    onClick={() => setSelectedEnrollment(enrollment)}
                    disabled={unblockLoading}
                  >
                    Unblock Student
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {selectedEnrollment && (
        <div
          className="students-modal-overlay"
          onClick={() => {
            if (!unblockLoading) setSelectedEnrollment(null);
          }}
        >
          <section
            className="students-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unblock-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon">↗</div>

            <h2 id="unblock-title">Unblock this student?</h2>

            <p>
              You are about to unblock{" "}
              <strong>
                {selectedEnrollment.student?.name || "this student"}
              </strong>
              . The student will be able to access the available content
              again.
            </p>

            <div className="confirm-actions">
              <button
                className="students-btn students-btn-secondary"
                onClick={() => setSelectedEnrollment(null)}
                disabled={unblockLoading}
              >
                Cancel
              </button>

              <button
                className="students-btn students-btn-unblock"
                onClick={handleUnblock}
                disabled={unblockLoading}
              >
                {unblockLoading ? "Unblocking..." : "Confirm Unblock"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default TeacherStudents;
