
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../features/notifications/notificationsSlice.js";
import "../../assets/css/notification/NotificationBell.css";

function NotificationBell() {
    const dispatch = useDispatch();

    const {
        notifications,
        loading,
        error,
        markLoadingId,
        markAllLoading,
    } = useSelector((state) => state.notifications);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const unreadCount = notifications.filter(
        (notification) => !notification.read_at
    ).length;

    function handleMarkAsRead(notificationId) {
        dispatch(markNotificationAsRead(notificationId));
    }

    function handleMarkAllAsRead() {
        dispatch(markAllNotificationsAsRead());
    }

    return (
        <div className="notification-container">
            <button
                type="button"
                className="notification-bell"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <span className="notification-bell-icon">🔔</span>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <h3>Notifications</h3>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={markAllLoading}
                            >
                                {markAllLoading
                                    ? "Please wait..."
                                    : "Mark all as read"}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p className="notification-message">
                            Loading notifications...
                        </p>
                    ) : error ? (
                        <p className="notification-error">{error}</p>
                    ) : notifications.length === 0 ? (
                        <p className="notification-message">
                            No notifications yet.
                        </p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map((notification) => {
                                const isRead = Boolean(notification.read_at);

                                return (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${
                                            isRead ? "is-read" : "is-unread"
                                        }`}
                                    >
                                        <div className="notification-item-content">
                                            <p>
                                                {notification.type === "new_enrollment"
                                                    ? `A new student has enrolled : ${
                                                        notification.payload?.student_name || "Student"
                                                    }`
                                                    : notification.payload?.message ||
                                                    notification.message ||
                                                    notification.type ||
                                                    "New notification"}
                                            </p>

                                            {notification.created_at && (
                                                <small>
                                                    {new Date(
                                                        notification.created_at
                                                    ).toLocaleString()}
                                                </small>
                                            )}
                                        </div>

                                        {!isRead && (
                                            <button
                                                type="button"
                                                className="notification-read-button"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                                disabled={
                                                    String(markLoadingId) ===
                                                    String(notification.id)
                                                }
                                            >
                                                {String(markLoadingId) ===
                                                String(notification.id)
                                                    ? "..."
                                                    : "Mark as read"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
