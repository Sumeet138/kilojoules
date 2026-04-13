import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchNotifications } from "../../../store/slices/notificationSlice";
import { markNotificationRead } from "../../../API/ApiStore";
import { FiBell } from "react-icons/fi";

export default function MemberNotifications() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(fetchNotifications("MEMBER"));
  }, [dispatch]);

  const handleMarkRead = async (n) => {
    if (n.isRead) return;
    try {
      await markNotificationRead(n.id);
      dispatch(fetchNotifications("MEMBER"));
    } catch {}
  };

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Notifications
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Announcements and updates from the gym · <span className="italic">Click an unread notification to mark it as read</span>
      </Typography>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiBell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No notifications yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n)}
              className={`bg-gym-cream border rounded-xl p-4 shadow-sm transition-all ${
                n.isRead ? "border-gym-beige-dark opacity-75" : "border-gym-warm cursor-pointer hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Typography variant="h6" className="font-semibold text-gym-text-primary">
                    {n.title}
                  </Typography>
                  <Typography variant="small" className="text-gym-text-secondary mt-1">
                    {n.message}
                  </Typography>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-gym-warm flex-shrink-0 mt-1" />
                )}
              </div>
              <Typography variant="small" className="text-gym-text-muted mt-2">
                {new Date(n.createdAt).toLocaleDateString()}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
