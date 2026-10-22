
import "../../assets/css/DeleteLessonModal.css";

function DeleteLessonModal({
                               lesson,
                               onCancel,
                               onConfirm,
                               loading = false,
                           }) {
    if (!lesson) return null;

    return (
        <div
            className="delete-modal-overlay"
            onClick={onCancel}
        >
            <div
                className="delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="delete-modal-icon">
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="m19 6-1 14H6L5 6" />
                        <path d="M10 11v5M14 11v5" />
                    </svg>
                </div>

                <h2 id="delete-modal-title">
                    Delete Lesson?
                </h2>

                <p className="delete-modal-description">
                    Are you sure you want to delete this lesson?
                </p>

                <div className="delete-modal-lesson">
                    {lesson.title}
                </div>

                <p className="delete-modal-warning">
                    This action cannot be undone.
                </p>

                <div className="delete-modal-actions">
                    <button
                        type="button"
                        className="delete-modal-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="delete-modal-confirm"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete Lesson"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteLessonModal;
