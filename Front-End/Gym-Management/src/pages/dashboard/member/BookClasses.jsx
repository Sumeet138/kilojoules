import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Chip, Alert } from "@material-tailwind/react";
import { fetchFitnessClasses } from "../../../store/slices/fitnessClassSlice";
import { bookClassThunk } from "../../../store/slices/classBookingSlice";
import { FiCalendar, FiClock } from "react-icons/fi";

const CLASS_COLORS = {
  YOGA: "bg-purple-100 text-purple-700",
  HIIT: "bg-red-100 text-red-700",
  ZUMBA: "bg-pink-100 text-pink-700",
  CROSSFIT: "bg-orange-100 text-orange-700",
  PILATES: "bg-blue-100 text-blue-700",
  SPINNING: "bg-yellow-100 text-yellow-700",
  BOXING: "bg-gray-100 text-gray-700",
  STRENGTH: "bg-green-100 text-green-700",
};

export default function BookClasses() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { classes, loading } = useSelector((s) => s.fitnessClass);
  const { loading: bookingLoading, error: bookingError } = useSelector((s) => s.classBooking);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    dispatch(fetchFitnessClasses());
  }, [dispatch]);

  const handleBook = async (classId) => {
    setSuccessMsg("");
    const result = await dispatch(bookClassThunk({ memberId: Number(memberId), classId }));
    if (bookClassThunk.fulfilled.match(result)) {
      setSuccessMsg("Class booked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const classTypes = ["ALL", ...new Set(classes.map((c) => c.classType))];
  const filtered = filterType === "ALL" ? classes : classes.filter((c) => c.classType === filterType);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Book a Class
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Browse and book fitness classes that match your goals
      </Typography>

      {successMsg && <Alert color="green" className="mb-4">{successMsg}</Alert>}
      {bookingError && <Alert color="red" className="mb-4">{bookingError}</Alert>}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {classTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterType === type
                ? "bg-gym-warm text-white shadow-sm"
                : "bg-gym-beige text-gym-text-secondary hover:bg-gym-beige-medium"
            }`}
          >
            {type}
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
            return (
              <div
                key={fc.id}
                className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CLASS_COLORS[fc.classType] || "bg-gym-beige text-gym-warm"}`}>
                    {fc.classType}
                  </span>
                  <span className={`text-xs font-medium ${isFull ? "text-red-500" : "text-green-600"}`}>
                    {isFull ? "Full" : `${spotsLeft} spots left`}
                  </span>
                </div>

                <Typography variant="h6" className="font-bold text-gym-text-primary mb-1">
                  {fc.className}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted mb-3">
                  Trainer: {fc.trainer ? `${fc.trainer.firstName} ${fc.trainer.lastName}` : "TBA"}
                </Typography>

                <div className="flex flex-col gap-1.5 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {fc.scheduledDay}</span>
                  <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {fc.scheduledTime} · {fc.durationMinutes} min</span>
                </div>

                <Button
                  onClick={() => handleBook(fc.id)}
                  disabled={isFull || bookingLoading}
                  fullWidth
                  size="sm"
                  className={`${isFull ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-gym-warm to-gym-warm-dark"} text-white`}
                >
                  {isFull ? "Fully Booked" : "Book Now"}
                </Button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <Typography className="text-gym-text-muted col-span-3 text-center py-10">
              No classes found.
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
