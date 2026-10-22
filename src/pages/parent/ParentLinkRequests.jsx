
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getLinkRequests,
    approveLinkRequest,
    resetApproveStatus,
} from "../../features/parent/parentSlice.js";
import "../../assets/css/parent/ParentLinkRequests.css";

export default function ParentLinkRequests() {
    const dispatch = useDispatch();

    const {
        linkRequests,
        loading,
        error,
        approveLoading,
        approveError,
        approveSuccess,
    } = useSelector((state) => state.parent);

    useEffect(() => {
        dispatch(getLinkRequests());
    }, [dispatch]);

    useEffect(() => {
        if (approveSuccess) {
            dispatch(getLinkRequests());
            dispatch(resetApproveStatus());
        }
    }, [approveSuccess, dispatch]);

    const handleApprove = (requestId) => {
        dispatch(approveLinkRequest(requestId));
    };

    if (loading && !linkRequests) {
        return (
            <div className="parent-requests-state">
                Loading link requests...
            </div>
        );
    }

    if (error) {
        return (
            <div className="parent-requests-state parent-requests-error">
                <p>{error}</p>
                <button onClick={() => dispatch(getLinkRequests())}>
                    Try Again
                </button>
            </div>
        );
    }

    const requests = linkRequests?.link_requests ?? [];

    return (
        <section className="parent-requests">
            <div className="parent-requests-header">
                <div>
                    <h1>Student Link Requests</h1>
                    <p>
                        Review student link requests and approve the appropriate
                        requests to connect students to your parent account.
                    </p>
                </div>

                <span className="parent-requests-count">
                {requests.length} Requests
            </span>
            </div>

            {approveError && (
                <div className="parent-requests-alert">
                    {approveError}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="parent-requests-empty">
                    <h3>No Link Requests Yet</h3>
                    <p>New link requests will appear here.</p>
                </div>
            ) : (
                <div className="parent-requests-list">
                    {requests.map((request) => (
                        <article
                            className="parent-request-card"
                            key={request.id}
                        >
                            <div className="parent-request-info">
                                <div className="parent-request-avatar">
                                    {request.student?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ?? "S"}
                                </div>

                                <div className="parent-request-details">
                                    <h3>
                                        {request.student?.name ??
                                            "Unknown Student"}
                                    </h3>

                                    <p>
                                        Email:{" "}
                                        {request.student?.email ?? "Not Available"}
                                    </p>

                                    <p>
                                        Phone:{" "}
                                        {request.student?.phone ?? "Not Available"}
                                    </p>

                                    <p>
                                        Invitation Method:{" "}
                                        {request.invite_contact ?? "Not Available"}
                                    </p>
                                </div>
                            </div>

                            <div className="parent-request-actions">
                            <span
                                className={`parent-request-status ${
                                    request.status === "pending"
                                        ? "is-pending"
                                        : "is-other"
                                }`}
                            >
                                {request.status === "pending"
                                    ? "Pending Approval"
                                    : request.status}
                            </span>

                                {request.status === "pending" && (
                                    <button
                                        className="parent-request-approve"
                                        onClick={() =>
                                            handleApprove(request.id)
                                        }
                                        disabled={approveLoading}
                                    >
                                        {approveLoading
                                            ? "Approving..."
                                            : "Approve Request"}
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
