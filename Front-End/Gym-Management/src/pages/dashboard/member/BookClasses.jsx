import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Alert } from "@material-tailwind/react";
import { fetchFitnessClasses } from "../../../store/slices/fitnessClassSlice";
import { bookClassThunk, fetchMemberBookings } from "../../../store/slices/classBookingSlice";
import { FiCalendar, FiClock, FiUser, FiCheck } from "react-icons/fi";

const CLASS_COLORS = {
  YOGA:     "bg-purple-100 text-purple-700",
  HIIT:     "bg-red-100 text-red-700",
  ZUMBA:    "bg-pink-100 text-pink-700",
  CROSSFIT: "bg-orange-100 text-orange-700",
  PILATES:  "bg-blue-100 text-blue-700",
  SPINNING: "bg-yellow-100 text-yellow-700",
  BOXING:   "bg-gray-100 text-gray-700",
  STRENGTH: "bg-green-100 text-green-700",
};

const DAYS_ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

export default function BookClasses() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { classes, loading } = useSelector((s) => s.fitnessClass);
  const { bookings, loading: bookingLoading, error: bookingError } = useSelector((s) => s.classBooking);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterDay, setFilterDay] = useState("ALL");

  useEffect(() => {
    dispatch(fetchFitnessClasses());
    if (memberId) dispatch(fetchMemberBookings(memberId));
  }, [dispatch, memberId]);

  const handleBook = async (classId) => {
    setSuccessMsg("");
    const result = await dispatch(bookClassThunk({ memberId: Number(memberId), classId }));
    if (bookClassThunk.fulfilled.match(result)) {
      setSuccessMsg("Class booked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      dispatch(fetchMemberBookings(memberId));
    }
  };

  const activeBookedClassIds = new Set(
    bookings
      .filter((b) => b.status === "BOOKED" || b.status === "ATTENDED")
      .map((b) => b.fitnessClass?.id)
      .filter(Boolean)
  );

  const classTypes = ["ALL", "MY BOOKINGS", ...new Set(classes.map((c) => c.classType))];
  const daysPresent = ["ALL", ...DAYS_ORDER.filter((d) => classes.some((c) => c.scheduledDay === d))];

  let filtered = classes;
  if (filterType === "MY BOOKINGS") {
    filtered = classes.filter((c) => activeBookedClassIds.has(c.id));
  } else if (filterType !== "ALL") {
    filtered = classes.filter((c) => c.classType === filterType);
  }
  if (filterDay !== "ALL") {
    filtered = filtered.filter((c) => c.scheduledDay === filterDay);
  }

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">
        Book a Class
      </Typography>
      <Typography className="text-gym-text-muted mb-5">
        Browse and book fitness classes that match your goals
      </Typography>

      {successMsg && <Alert color="green" className="mb-4">{successMsg}</Alert>}
      {bookingError && <Alert color="red" className="mb-4">{String(bookingError)}</Alert>}

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        {classTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterType === type
                ? type === "MY BOOKINGS"
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-gym-warm text-white shadow-sm"
                : "bg-gym-beige text-gym-text-secondary hover:bg-gym-beige-medium"
            }`}
          >
            {type === "MY BOOKINGS" ? `✓ My Bookings (${activeBookedClassIds.size})` : type}
          </button>
        ))}
      </div>

      {/* Day filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {daysPresent.map((day) => (
          <button
            key={day}
            onClick={() => setFilterDay(day)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterDay === day
                ? "bg-gray-700 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {day === "ALL" ? "All Days" : day.slice(0, 3)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((fc) => {
            const spotsLeft = fc.capacity - fc.currentEnrollment;
            const isFull = spotsLeft <= 0;
            const isBooked = activeBookedClassIds.has(fc.id);
            const booking = bookings.find((b) => b.fitnessClass?.id === fc.id);

            return (
              <div
                key={fc.id}
                className={`relative border rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md ${
                  isBooked
                    ? "bg-green-50 border-green-200"
                    : "bg-gym-cream border-gym-beige-dark"
                }`}
              >
                {isBooked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <FiCheck className="w-3 h-3" /> Booked
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CLASS_COLORS[fc.classType] || "bg-gym-beige text-gym-warm"}`}>
                    {fc.classType}
                  </span>
                  {!isBooked && (
                    <span className={`text-xs font-medium ${isFull ? "text-red-500" : "text-green-600"}`}>
                      {isFull ? "Full" : `${spotsLeft} spots left`}
                    </span>
                  )}
                </div>

                <Typography variant="h6" className="font-bold text-gym-text-primary mb-1">
                  {fc.className}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted mb-3 flex items-center gap-1">
                  <FiUser className="w-3 h-3" />
                  {fc.trainer ? `${fc.trainer.firstName} ${fc.trainer.lastName}` : "TBA"}
                </Typography>

                <div className="flex flex-col gap-1.5 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {fc.scheduledDay}</span>
                  <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {fc.scheduledTime} · {fc.durationMinutes} min</span>
                </div>

                {isBooked ? (
                  <div className="w-full text-center text-sm font-semibold text-green-600 bg-green-100 rounded-lg py-2">
                    ✓ You are booked · {booking?.status}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleBook(fc.id)}
                    disabled={isFull || bookingLoading}
                    fullWidth
                    size="sm"
                    className={`${isFull ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-gym-warm to-gym-warm-dark"} text-white`}
                  >
                    {isFull ? "Fully Booked" : "Book Now"}
                  </Button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gym-text-muted">
              {filterType === "MY BOOKINGS"
                ? "You haven't booked any classes yet."
                : "No classes found for this filter."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
