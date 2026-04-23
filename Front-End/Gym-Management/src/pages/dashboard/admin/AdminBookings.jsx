import { useEffect, useState, useRef } from "react";
import { Typography, Alert } from "@material-tailwind/react";
import { getPendingBookings, approveBooking, rejectBooking } from "../../../API/ApiStore";
import { FiCheckCircle, FiXCircle, FiClock, FiRefreshCw } from "react-icons/fi";

export default function AdminBookings() {
  const [pending,    setPending]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [actionId,   setActionId]   = useState(null);
  const [rejectId,   setRejectId]   = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [msg,        setMsg]        = useState({ type: "", text: "" });
  const timerRef = useRef(null);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPendingBookings();
      setPending(res.data || []);
    } catch {
      flash("red", "Failed to load pending bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 30000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await approveBooking(id);
      flash("green", "Booking approved — member and trainer notified.");
      setPending((p) => p.filter((b) => b.id !== id));
    } catch (e) {
      flash("red", e.response?.data || "Failed to approve.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActionId(rejectId);
    try {
      await rejectBooking(rejectId, rejectNote);
      flash("amber", "Booking rejected — member notified.");
      setPending((p) => p.filter((b) => b.id !== rejectId));
    } catch (e) {
      flash("red", e.response?.data || "Failed to reject.");
    } finally {
      setActionId(null);
      setRejectId(null);
      setRejectNote("");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Class Booking Approvals</Typography>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gym-beige-dark rounded-xl text-gym-text-secondary hover:bg-gym-beige transition-colors"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
      <Typography className="text-gym-text-muted mb-5">
        Review and approve or reject member class booking requests. Auto-refreshes every 30s.
      </Typography>

      {msg.text && <Alert color={msg.type} className="mb-4 text-sm">{msg.text}</Alert>}

      {/* Reject reason modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <Typography variant="h6" className="font-bold text-gym-text-primary mb-2">Reject Booking</Typography>
            <p className="text-sm text-gym-text-muted mb-3">Optionally provide a reason — it will be sent to the member.</p>
            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g. Class is full, schedule conflict…"
              className="w-full border border-gym-beige-dark rounded-xl px-3 py-2 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={actionId === rejectId}
                className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-50"
              >
                {actionId === rejectId ? "Rejecting…" : "Confirm Reject"}
              </button>
              <button
                onClick={() => { setRejectId(null); setRejectNote(""); }}
                className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && pending.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : pending.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiClock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No pending booking requests.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {pending.length} Pending
            </span>
          </div>
          <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gym-beige">
                <tr>
                  {["Member", "Class", "Type", "Day & Time", "Trainer", "Fee", "Requested On", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((b, idx) => (
                  <tr key={b.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                    <td className="px-4 py-3 font-medium text-gym-text-primary whitespace-nowrap">
                      {b.memberName || (b.memberId ? `Member #${b.memberId}` : "—")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gym-text-primary whitespace-nowrap">
                      {b.fitnessClass?.className || "—"}
                    </td>
                    <td className="px-4 py-3 text-gym-text-secondary">{b.fitnessClass?.classType || "—"}</td>
                    <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">
                      {b.fitnessClass?.scheduledDay} {b.fitnessClass?.scheduledTime}
                    </td>
                    <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">
                      {b.fitnessClass?.trainer
                        ? `${b.fitnessClass.trainer.firstName} ${b.fitnessClass.trainer.lastName}`
                        : "TBA"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gym-warm whitespace-nowrap">
                      {b.fitnessClass?.price ? `₹${b.fitnessClass.price}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gym-text-muted whitespace-nowrap">{b.bookingDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleApprove(b.id)}
                          disabled={actionId === b.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          {actionId === b.id ? "…" : "Approve"}
                        </button>
                        <button
                          onClick={() => setRejectId(b.id)}
                          disabled={actionId === b.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          <FiXCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
