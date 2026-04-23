import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Alert } from "@material-tailwind/react";
import { fetchMemberBookings, cancelBookingThunk } from "../../../store/slices/classBookingSlice";
import { FiCalendar, FiX } from "react-icons/fi";

const STATUS_STYLES = {
  BOOKED:    "bg-blue-100 text-blue-700",
  ATTENDED:  "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  NO_SHOW:   "bg-gray-100 text-gray-600",
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

  const booked   = bookings.filter((b) => b.status === "BOOKED").length;
  const attended = bookings.filter((b) => b.status === "ATTENDED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">My Bookings</Typography>
      <Typography className="text-gym-text-muted mb-5">Track your class attendance and booking history</Typography>

      {msg.text && <Alert color={msg.type} className="mb-4">{msg.text}</Alert>}

      {/* Summary */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Upcoming",  value: booked,    color: "bg-blue-50 border-blue-200 text-blue-700" },
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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "BOOKED" && (
                      <button
                        onClick={() => handleCancel(b)}
                        disabled={cancellingId === b.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <FiX className="w-3 h-3" />
                        {cancellingId === b.id ? "Cancelling…" : "Cancel"}
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
