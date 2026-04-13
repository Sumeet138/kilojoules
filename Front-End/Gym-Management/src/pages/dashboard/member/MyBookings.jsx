import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchMemberBookings } from "../../../store/slices/classBookingSlice";
import { FiCalendar } from "react-icons/fi";

const STATUS_STYLES = {
  BOOKED: "bg-blue-100 text-blue-700",
  ATTENDED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  NO_SHOW: "bg-gray-100 text-gray-600",
};

export default function MyBookings() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { bookings, loading } = useSelector((s) => s.classBooking);

  useEffect(() => {
    if (memberId) dispatch(fetchMemberBookings(memberId));
  }, [dispatch, memberId]);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        My Bookings
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Track your class attendance and booking history
      </Typography>

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
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Class", "Type", "Day & Time", "Booking Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr
                  key={b.id}
                  className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}
                >
                  <td className="px-4 py-3 font-medium text-gym-text-primary">
                    {b.fitnessClass?.className || "—"}
                  </td>
                  <td className="px-4 py-3 text-gym-text-secondary">
                    {b.fitnessClass?.classType || "—"}
                  </td>
                  <td className="px-4 py-3 text-gym-text-secondary">
                    {b.fitnessClass?.scheduledDay} {b.fitnessClass?.scheduledTime}
                  </td>
                  <td className="px-4 py-3 text-gym-text-muted">{b.bookingDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>
                      {b.status}
                    </span>
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
