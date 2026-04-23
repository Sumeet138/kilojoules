import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Alert } from "@material-tailwind/react";
import { fetchMemberBookings, cancelBookingThunk } from "../../../store/slices/classBookingSlice";
import { FiCalendar, FiX, FiClock } from "react-icons/fi";

const STATUS_STYLES = {
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
  BOOKED:    "bg-blue-100 text-blue-700",
  ATTENDED:  "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  NO_SHOW:   "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  PENDING_APPROVAL: "Awaiting Approval",
  BOOKED:    "Approved",
  ATTENDED:  "Attended",
  CANCELLED: "Cancelled",
  NO_SHOW:   "No Show",
};

export default function MyBookings() {
  const dispatch  = useDispatch();
  const memberId  = localStorage.getItem("memberId");
  const { bookings, loading } = useSelector((s) => s.classBooking);
  const [cancellingId, setCancellingId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (memberId) dispatch(fetchMemberBookings(memberId));
  }, [dispatch, memberId]);

  const handleCancel = async (b) => {
    if (!window.confirm(`Cancel booking for "${b.fitnessClass?.className}"?`)) return;
    setCancellingId(b.id);
    const result = await dispatch(cancelBookingThunk(b.id));
    setCancellingId(null);
    if (cancelBookingThunk.fulfilled.match(result)) {
      setMsg({ type: "amber", text: `Booking for "${b.fitnessClass?.className}" cancelled.` });
    } else {
      setMsg({ type: "red", text: String(result.payload || "Failed to cancel.") });
    }
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const pending   = bookings.filter((b) => b.status === "PENDING_APPROVAL").length;
  const booked    = bookings.filter((b) => b.status === "BOOKED").length;
  const attended  = bookings.filter((b) => b.status === "ATTENDED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  /* Auto-poll every 30s so status updates show without manual refresh */
  const timerRef = useRef(null);
  useEffect(() => {
    if (!memberId) return;
    timerRef.current = setInterval(() => dispatch(fetchMemberBookings(memberId)), 30000);
    return () => clearInterval(timerRef.current);
  }, [dispatch, memberId]);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">My Bookings</Typography>
      <Typography className="text-gym-text-muted mb-5">Track your class attendance and booking history</Typography>

      {msg.text && <Alert color={msg.type} className="mb-4">{msg.text}</Alert>}

      {/* Summary */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Pending",   value: pending,   color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
            { label: "Approved",  value: booked,    color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Attended",  value: attended,  color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Cancelled", value: cancelled, color: "bg-red-50 border-red-200 text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs font-medium opacity-80">{label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiCalendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No bookings yet. Go book a class!
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Class", "Type", "Trainer", "Day & Time", "Fee", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 font-medium text-gym-text-primary whitespace-nowrap">
                    {b.fitnessClass?.className || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-gym-text-secondary">{b.fitnessClass?.classType || "\u2014"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">
                    {b.fitnessClass?.trainer
                      ? `${b.fitnessClass.trainer.firstName} ${b.fitnessClass.trainer.lastName}`
                      : "TBA"}
                  </td>
                  <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">
                    {b.fitnessClass?.scheduledDay} {b.fitnessClass?.scheduledTime}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gym-warm whitespace-nowrap">
                    {b.fitnessClass?.price ? `\u20b9${b.fitnessClass.price}` : "\u2014"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold w-fit ${STATUS_STYLES[b.status] || ""}`}>
                      {b.status === "PENDING_APPROVAL" && <FiClock className="w-3 h-3" />}
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(b.status === "PENDING_APPROVAL" || b.status === "BOOKED") && (
                      <button
                        onClick={() => handleCancel(b)}
                        disabled={cancellingId === b.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <FiX className="w-3 h-3" />
                        {cancellingId === b.id ? "Revoking…" : b.status === "PENDING_APPROVAL" ? "Revoke" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
