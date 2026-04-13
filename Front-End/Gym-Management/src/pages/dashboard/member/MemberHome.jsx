import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchMemberBookings } from "../../../store/slices/classBookingSlice";
import { fetchBMIHistory } from "../../../store/slices/bmiSlice";
import { fetchMemberTransactions } from "../../../store/slices/transactionSlice";
import { fetchWorkouts } from "../../../store/slices/workoutHistorySlice";
import { FiCalendar, FiActivity, FiTrendingUp, FiDollarSign } from "react-icons/fi";

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
    { color: "warm",  icon: <FiCalendar className="w-5 h-5" />,    title: "Classes Booked",  value: bookings.length,                            footer: "Total bookings" },
    { color: "brown", icon: <FiActivity className="w-5 h-5" />,    title: "Workouts Logged", value: workouts.length,                            footer: "Keep it up!" },
    { color: "blue",  icon: <FiTrendingUp className="w-5 h-5" />,  title: "Latest BMI",      value: latestBMI ? `${latestBMI.bmi}` : "\u2014", footer: latestBMI ? latestBMI.category : "No record yet" },
    { color: "green", icon: <FiDollarSign className="w-5 h-5" />,  title: "Total Spent",     value: `\u20B9${totalSpent}`,                     footer: "All transactions" },
  ];

  return (
    <div className="mt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {memberData.firstName || "Member"}
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's a snapshot of your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ color, icon, title, value, footer }) => (
          <StatisticsCard key={title} color={color} icon={icon} title={title} value={String(value)} footer={footer} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Recent Bookings</h3>
          {bookings.slice(0, 5).length === 0 ? (
            <p className="text-gray-400 text-sm">No bookings yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.fitnessClass?.className || "Class"}</p>
                    <p className="text-xs text-gray-400">{b.bookingDate}</p>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    b.status === "ATTENDED" ? "bg-emerald-50 text-emerald-600"
                    : b.status === "CANCELLED" ? "bg-red-50 text-red-500"
                    : "bg-orange-50 text-orange-600"
                  }`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Recent Workouts</h3>
          {workouts.slice(0, 5).length === 0 ? (
            <p className="text-gray-400 text-sm">No workouts logged yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {workouts.slice(0, 5).map((w) => (
                <li key={w.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.exerciseName}</p>
                    <p className="text-xs text-gray-400">
                      {w.sets}s &times; {w.reps}r{w.weightKg ? ` @ ${w.weightKg}kg` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{w.workoutDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
