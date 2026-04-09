import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";
import { getClassBookings } from "../../../API/ApiStore";

export default function TrainerAttendance() {
  const dispatch = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { trainerClasses } = useSelector((s) => s.fitnessClass);
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerClasses(trainerId));
  }, [dispatch, trainerId]);

  const handleSelectClass = async (fc) => {
    setSelectedClass(fc);
    setLoadingBookings(true);
    try {
      const res = await getClassBookings(fc.id);
      setBookings(res.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const STATUS_STYLES = {
    BOOKED: "bg-blue-100 text-blue-700",
    ATTENDED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-600",
    NO_SHOW: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Attendance
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        View member attendance for your classes
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Class list */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">
            Select Class
          </Typography>
          {trainerClasses.length === 0 ? (
            <Typography variant="small" className="text-gym-text-muted">No classes.</Typography>
          ) : (
            <ul className="flex flex-col gap-2">
              {trainerClasses.map((fc) => (
                <li key={fc.id}>
                  <button
                    onClick={() => handleSelectClass(fc)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedClass?.id === fc.id
                        ? "bg-gym-warm text-white"
                        : "hover:bg-gym-beige text-gym-text-secondary"
                    }`}
                  >
                    <div className="font-medium">{fc.className}</div>
                    <div className="text-xs opacity-75">{fc.scheduledDay} {fc.scheduledTime}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Attendance table */}
        <div className="lg:col-span-2 bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
          {!selectedClass ? (
            <div className="flex items-center justify-center h-40 text-gym-text-muted">
              Select a class to view attendance
            </div>
          ) : loadingBookings ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gym-warm border-t-transparent" />
            </div>
          ) : (
            <>
              <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">
                {selectedClass.className} — {bookings.length} bookings
              </Typography>
              {bookings.length === 0 ? (
                <Typography className="text-gym-text-muted text-sm">No bookings for this class.</Typography>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gym-beige">
                    <tr>
                      {["Member", "Booking Date", "Status"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-gym-text-secondary">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, idx) => (
                      <tr key={b.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                        <td className="px-3 py-2 text-gym-text-primary">
                          {b.member ? `${b.member.firstName} ${b.member.lastName}` : b.memberId}
                        </td>
                        <td className="px-3 py-2 text-gym-text-muted">{b.bookingDate}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
