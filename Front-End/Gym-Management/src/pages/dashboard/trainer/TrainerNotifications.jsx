import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchNotifications } from "../../../store/slices/notificationSlice";

export default function TrainerNotifications() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(fetchNotifications("TRAINER"));
  }, [dispatch]);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Notifications
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Updates and announcements for trainers
      </Typography>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <span className="text-5xl block mb-3">🔔</span>
          No notifications.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-gym-cream border rounded-xl p-4 shadow-sm ${n.isRead ? "border-gym-beige-dark" : "border-gym-brown"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Typography variant="h6" className="font-semibold text-gym-text-primary">{n.title}</Typography>
                  <Typography variant="small" className="text-gym-text-secondary mt-1">{n.message}</Typography>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-gym-brown flex-shrink-0 mt-1" />}
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
