import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";
import { getClassBookings, markBookingAttended, markBookingNoShow } from "../../../API/ApiStore";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";

const STATUS_STYLES = {
  BOOKED:    "bg-blue-100 text-blue-700",
  ATTENDED:  "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  NO_SHOW:   "bg-gray-100 text-gray-600",
};

const todayStr = () => new Date().toISOString().split("T")[0];

export default function TrainerAttendance() {
  const dispatch  = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { trainerClasses } = useSelector((s) => s.fitnessClass);

  const [selectedClass,  setSelectedClass]  = useState(null);
  const [bookings,       setBookings]       = useState([]);
  const [loadingBookings,setLoadingBookings]= useState(false);
  const [actionId,       setActionId]       = useState(null);
  const [sessionDate,    setSessionDate]    = useState(todayStr());

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerClasses(trainerId));
  }, [dispatch, trainerId]);

  /* Deduplicate sidebar — same class can have many DB rows; group by name+day+time,
     keep the one with most enrollments (usually the "real" one). */
  const uniqueClasses = useMemo(() => {
    const seen = new Map();
    for (const fc of trainerClasses) {
      const key = `${fc.className}|${fc.scheduledDay}|${fc.scheduledTime}`;
      const existing = seen.get(key);
      if (!existing || fc.currentEnrollment > existing.currentEnrollment) {
        seen.set(key, fc);
      }
    }
    return Array.from(seen.values());
  }, [trainerClasses]);

  const loadBookings = async (fc, date) => {
    setLoadingBookings(true);
    try {
      const res = await getClassBookings(fc.id, date);
      setBookings(res.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSelectClass = (fc) => {
    setSelectedClass(fc);
    loadBookings(fc, sessionDate);
  };

  const handleDateChange = (d) => {
    setSessionDate(d);
    if (selectedClass) loadBookings(selectedClass, d);
  };

  const handleAction = async (bookingId, action) => {
    setActionId(bookingId);
    try {
      if (action === "attend") await markBookingAttended(bookingId);
      else await markBookingNoShow(bookingId);
      setBookings((prev) =>
        prev.map((b) => b.id === bookingId
          ? { ...b, status: action === "attend" ? "ATTENDED" : "NO_SHOW" }
          : b)
      );
    } catch {
    } finally {
      setActionId(null);
    }
  };

  const booked   = bookings.filter((b) => b.status === "BOOKED").length;
  const attended = bookings.filter((b) => b.status === "ATTENDED").length;
  const noShow   = bookings.filter((b) => b.status === "NO_SHOW").length;

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">Attendance</Typography>
      <Typography className="text-gym-text-muted mb-5">
        Mark attendance per session — each booking date is one session
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Class sidebar */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">Select Class</Typography>
          {uniqueClasses.length === 0 ? (
            <p className="text-sm text-gym-text-muted">No classes assigned.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {uniqueClasses.map((fc) => (
                <li key={fc.id}>
                  <button
                    onClick={() => handleSelectClass(fc)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedClass?.id === fc.id
                        ? "bg-gym-warm text-white"
                        : "hover:bg-gym-beige text-gym-text-secondary"
                    }`}
                  >
                    <div className="font-semibold">{fc.className}</div>
                    <div className="text-xs opacity-70">{fc.scheduledDay} {fc.scheduledTime}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Attendance panel */}
        <div className="lg:col-span-2 bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
          {!selectedClass ? (
            <div className="flex flex-col items-center justify-center h-48 text-gym-text-muted gap-2">
              <FiCalendar className="w-8 h-8 text-gray-300" />
              <p>Select a class from the left</p>
            </div>
          ) : (
            <>
              {/* Header + date picker */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Typography variant="h6" className="font-bold text-gym-text-primary">
                  {selectedClass.className}
                </Typography>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gym-text-muted font-medium">Session date:</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="rounded-lg border border-gym-beige-dark bg-white px-2 py-1 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none"
                  />
                  <button
                    onClick={() => loadBookings(selectedClass, sessionDate)}
                    className="p-1.5 rounded-lg border border-gym-beige-dark text-gym-text-muted hover:bg-gym-beige transition-colors"
                    title="Refresh"
                  >
                    <FiRefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-blue-100  text-blue-700  text-xs font-semibold px-2.5 py-1 rounded-full">{booked} Pending</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">{attended} Attended</span>
                <span className="bg-gray-100  text-gray-600  text-xs font-semibold px-2.5 py-1 rounded-full">{noShow} No-Show</span>
                <span className="bg-gym-beige text-gym-text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">{bookings.length} Total</span>
              </div>

              {loadingBookings ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gym-warm border-t-transparent" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10 text-gym-text-muted text-sm">
                  No bookings for <strong>{sessionDate}</strong>.<br />
                  <span className="text-xs">Members book the class on the day they attend.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gym-beige">
                      <tr>
                        {["Member", "Booked On", "Status", "Actions"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-gym-text-secondary whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, idx) => (
                        <tr key={b.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                          <td className="px-3 py-2.5 font-medium text-gym-text-primary whitespace-nowrap">
                            {b.memberName || (b.memberId ? `Member #${b.memberId}` : "—")}
                          </td>
                          <td className="px-3 py-2.5 text-gym-text-muted whitespace-nowrap">{b.bookingDate}</td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            {b.status === "BOOKED" && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleAction(b.id, "attend")}
                                  disabled={actionId === b.id}
                                  className="px-2.5 py-1 text-xs font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                >
                                  {actionId === b.id ? "…" : "✓ Attended"}
                                </button>
                                <button
                                  onClick={() => handleAction(b.id, "noshow")}
                                  disabled={actionId === b.id}
                                  className="px-2.5 py-1 text-xs font-semibold bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors"
                                >
                                  {actionId === b.id ? "…" : "✗ No Show"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
