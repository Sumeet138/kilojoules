import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchMemberBookings } from "../../../store/slices/classBookingSlice";
import { fetchBMIHistory } from "../../../store/slices/bmiSlice";
import { fetchMemberTransactions } from "../../../store/slices/transactionSlice";
import { fetchWorkouts } from "../../../store/slices/workoutHistorySlice";

export default function MemberHome() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const memberData = JSON.parse(localStorage.getItem("memberData") || "{}");

  const { bookings } = useSelector((s) => s.classBooking);
  const { records: bmiRecords } = useSelector((s) => s.bmi);
  const { transactions } = useSelector((s) => s.transaction);
  const { workouts } = useSelector((s) => s.workoutHistory);

  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberBookings(memberId));
      dispatch(fetchBMIHistory(memberId));
      dispatch(fetchMemberTransactions(memberId));
      dispatch(fetchWorkouts(memberId));
    }
  }, [dispatch, memberId]);

  const latestBMI = bmiRecords[0];
  const totalSpent = transactions
    .reduce((sum, t) => sum + (t.amount || 0), 0)
    .toFixed(2);

  const stats = [
    {
      color: "warm",
      icon: "📅",
      title: "Classes Booked",
      value: bookings.length,
      footer: "Total bookings",
    },
    {
      color: "brown",
      icon: "💪",
      title: "Workouts Logged",
      value: workouts.length,
      footer: "Keep it up!",
    },
    {
      color: "beige",
      icon: "⚖️",
      title: "Latest BMI",
      value: latestBMI ? `${latestBMI.bmi}` : "—",
      footer: latestBMI ? latestBMI.bmiCategory : "No record yet",
    },
    {
      color: "green",
      icon: "💰",
      title: "Total Spent",
      value: `₹${totalSpent}`,
      footer: "All transactions",
    },
  ];

  return (
    <div className="mt-4">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Welcome back, {memberData.firstName || "Member"} 👋
        </Typography>
        <Typography className="text-gym-text-muted mt-1">
          Here's a snapshot of your fitness journey
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ color, icon, title, value, footer }) => (
          <StatisticsCard
            key={title}
            color={color}
            icon={<span className="text-2xl">{icon}</span>}
            title={title}
            value={String(value)}
            footer={<span className="text-gym-text-muted text-xs">{footer}</span>}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            Recent Bookings
          </Typography>
          {bookings.slice(0, 5).length === 0 ? (
            <Typography className="text-gym-text-muted text-sm">No bookings yet.</Typography>
          ) : (
            <ul className="flex flex-col gap-3">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between border-b border-gym-beige pb-2">
                  <div>
                    <Typography variant="small" className="font-semibold text-gym-text-primary">
                      {b.fitnessClass?.className || "Class"}
                    </Typography>
                    <Typography variant="small" className="text-gym-text-muted">
                      {b.bookingDate}
                    </Typography>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === "ATTENDED"
                      ? "bg-green-100 text-green-700"
                      : b.status === "CANCELLED"
                      ? "bg-red-100 text-red-600"
                      : "bg-gym-beige text-gym-warm-dark"
                  }`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            Recent Workouts
          </Typography>
          {workouts.slice(0, 5).length === 0 ? (
            <Typography className="text-gym-text-muted text-sm">No workouts logged yet.</Typography>
          ) : (
            <ul className="flex flex-col gap-3">
              {workouts.slice(0, 5).map((w) => (
                <li key={w.id} className="flex items-center justify-between border-b border-gym-beige pb-2">
                  <div>
                    <Typography variant="small" className="font-semibold text-gym-text-primary">
                      {w.exerciseName}
                    </Typography>
                    <Typography variant="small" className="text-gym-text-muted">
                      {w.sets} sets × {w.reps} reps
                      {w.weightKg ? ` @ ${w.weightKg}kg` : ""}
                    </Typography>
                  </div>
                  <Typography variant="small" className="text-gym-text-muted">
                    {w.workoutDate}
                  </Typography>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
