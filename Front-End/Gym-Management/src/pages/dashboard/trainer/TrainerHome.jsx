import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";
import { FiActivity, FiUsers, FiGrid, FiTrendingUp, FiCalendar, FiClock } from "react-icons/fi";

export default function TrainerHome() {
  const dispatch = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const trainerData = JSON.parse(localStorage.getItem("trainerData") || "{}");
  const { trainerClasses } = useSelector((s) => s.fitnessClass);

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerClasses(trainerId));
  }, [dispatch, trainerId]);

  const activeClasses = trainerClasses.filter((c) => c.isActive);
  const totalCapacity = activeClasses.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const totalEnrolled = activeClasses.reduce((sum, c) => sum + (c.currentEnrollment || 0), 0);

  const stats = [
    { color: "warm",  icon: <FiActivity className="w-5 h-5" />,    title: "Active Classes",  value: activeClasses.length,                                                    footer: "Classes you run" },
    { color: "brown", icon: <FiUsers className="w-5 h-5" />,       title: "Total Enrolled",  value: totalEnrolled,                                                           footer: "Across all classes" },
    { color: "blue",  icon: <FiGrid className="w-5 h-5" />,        title: "Total Capacity",  value: totalCapacity,                                                           footer: "Available spots" },
    { color: "green", icon: <FiTrendingUp className="w-5 h-5" />,  title: "Fill Rate",       value: totalCapacity ? `${Math.round((totalEnrolled / totalCapacity) * 100)}%` : "\u2014", footer: "Enrollment rate" },
  ];

  return (
    <div className="mt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {trainerData.firstName || "Trainer"}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {trainerData.specialization && `Specialization: ${trainerData.specialization}`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ color, icon, title, value, footer }) => (
          <StatisticsCard key={title} color={color} icon={icon} title={title} value={String(value)} footer={footer} />
        ))}
      </div>

      <h3 className="font-semibold text-gray-900 mb-4 text-sm">Your Classes</h3>
      {activeClasses.length === 0 ? (
        <p className="text-gray-400 text-sm">No active classes assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeClasses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="font-semibold text-gray-900 mb-1.5">{c.className}</p>
              <span className="text-[11px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{c.classType}</span>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {c.scheduledDay} at {c.scheduledTime}</span>
                <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {c.durationMinutes} min</span>
                <span className="flex items-center gap-1.5"><FiUsers className="w-3.5 h-3.5" /> {c.currentEnrollment}/{c.capacity} enrolled</span>
              </div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-orange-500 rounded-full h-1.5 transition-all"
                  style={{ width: `${Math.min(100, (c.currentEnrollment / c.capacity) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
