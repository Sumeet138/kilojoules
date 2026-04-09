import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchNotifications } from "../../../store/slices/notificationSlice";
import { createNotification, deleteNotification } from "../../../API/ApiStore";

const RECIPIENT_TYPES = ["ALL", "MEMBER", "TRAINER", "ADMIN"];

export default function AdminNotifications() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.notification);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", recipientType: "ALL" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createNotification(form);
      setSuccess("Notification sent!");
      dispatch(fetchNotifications());
      setShowForm(false);
      setForm({ title: "", message: "", recipientType: "ALL" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to send notification.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      dispatch(fetchNotifications());
      setSuccess("Notification deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete.");
    }
  };

  const RECIPIENT_COLORS = {
    ALL: "bg-purple-100 text-purple-700",
    MEMBER: "bg-blue-100 text-blue-700",
    TRAINER: "bg-gym-beige text-gym-warm-dark",
    ADMIN: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Notifications</Typography>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setError(""); }}
          className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
          {showForm ? "Cancel" : "+ Send Notification"}
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-5">Broadcast messages to members, trainers, or all</Typography>

      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      {showForm && (
        <form onSubmit={handleSend} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">New Notification</Typography>
          {error && <Alert color="red" className="mb-3 text-sm">{error}</Alert>}
          <div className="flex flex-col gap-3">
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Title *</Typography>
              <Input name="title" placeholder="Notification title" value={form.title} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Message *</Typography>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none resize-none"
              />
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Recipient *</Typography>
              <select name="recipientType" value={form.recipientType} onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none">
                {RECIPIENT_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <Button type="submit" loading={submitting} className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white mt-1">
              {submitting ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <span className="text-5xl block mb-3">🔔</span>
          No notifications sent yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography variant="h6" className="font-semibold text-gym-text-primary">{n.title}</Typography>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${RECIPIENT_COLORS[n.recipientType] || ""}`}>
                      {n.recipientType}
                    </span>
                  </div>
                  <Typography variant="small" className="text-gym-text-secondary">{n.message}</Typography>
                  <Typography variant="small" className="text-gym-text-muted mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </div>
                <Button size="sm" variant="text" onClick={() => handleDelete(n.id)} className="text-red-500 p-0 flex-shrink-0">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
