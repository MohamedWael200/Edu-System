import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendParentInvitation } from "../../features/student/studentLessonsSlice";
import "../../assets/css/student/StudentParentInvitation.css";

export default function StudentParentInvitation() {
    const dispatch = useDispatch();

    const {
        parentInvitation,
        parentInvitationLoading,
        parentInvitationError,
    } = useSelector((state) => state.studentLessons);

    const [inviteContact, setInviteContact] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const contact = inviteContact.trim();

        if (!contact) return;

        const result = await dispatch(
            sendParentInvitation({
                inviteContact: contact,
            })
        );

        if (sendParentInvitation.fulfilled.match(result)) {
            setInviteContact("");
        }
    };

    const invitation = parentInvitation?.link;

    return (
        <main className="parent-invitation-page">
            <header className="parent-invitation-header">
                <span className="parent-invitation-eyebrow">
                    STUDENT PORTAL
                </span>

                <h1>Parent Connection</h1>

                <p>
                    Connect your parent or guardian to your account so they
                    can follow your academic progress and results.
                </p>
            </header>

            <section className="parent-invitation-card">
                <div className="parent-invitation-icon" aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="8" r="3.5" />
                        <path d="M2.5 20v-2a6.5 6.5 0 0 1 13 0v2" />
                        <path d="M16 5.5a3.5 3.5 0 0 1 0 6.8" />
                        <path d="M18 14a5 5 0 0 1 3.5 4.8V20" />
                    </svg>
                </div>

                <div className="parent-invitation-card-heading">
                    <h2>Invite a Parent or Guardian</h2>
                    <p>
                        Enter the email address or phone number associated
                        with your parent&apos;s account.
                    </p>
                </div>

                <form
                    className="parent-invitation-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="inviteContact">
                        Email address or phone number
                    </label>

                    <input
                        id="inviteContact"
                        name="inviteContact"
                        type="text"
                        value={inviteContact}
                        onChange={(event) =>
                            setInviteContact(event.target.value)
                        }
                        placeholder="e.g. parent@example.com"
                        autoComplete="email"
                        required
                    />

                    {parentInvitationError && (
                        <div
                            className="parent-invitation-error"
                            role="alert"
                        >
                            {parentInvitationError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={
                            parentInvitationLoading ||
                            !inviteContact.trim()
                        }
                    >
                        {parentInvitationLoading ? (
                            <>
                                <span className="parent-invitation-spinner" />
                                Sending invitation...
                            </>
                        ) : (
                            <>
                                Send Invitation
                                <span aria-hidden="true">→</span>
                            </>
                        )}
                    </button>
                </form>

                {invitation && (
                    <div
                        className="parent-invitation-success"
                        role="status"
                    >
                        <div className="parent-invitation-success-title">
                            <span className="parent-invitation-check">
                                ✓
                            </span>

                            <div>
                                <h3>Invitation Created</h3>
                                <p>
                                    Your invitation has been sent successfully.
                                </p>
                            </div>
                        </div>

                        <div className="parent-invitation-details">
                            <div className="parent-invitation-detail-row">
                                <span>Contact</span>
                                <strong>{invitation.invite_contact}</strong>
                            </div>

                            <div className="parent-invitation-detail-row">
                                <span>Invitation ID</span>
                                <strong>#{invitation.id}</strong>
                            </div>

                            <div className="parent-invitation-detail-row">
                                <span>Status</span>
                                <span className="parent-invitation-status">
                                    <span className="parent-invitation-status-dot" />
                                    {invitation.status === "pending"
                                        ? "Pending Approval"
                                        : invitation.status}
                                </span>
                            </div>
                        </div>

                        <p className="parent-invitation-note">
                            Your parent will be able to access your academic
                            overview after approving the invitation.
                        </p>
                    </div>
                )}

                <div className="parent-invitation-footnote">
                    <span aria-hidden="true">🔒</span>
                    <span>
                        Your academic information is only available to a
                        linked parent after approval.
                    </span>
                </div>
            </section>
        </main>
    );
}