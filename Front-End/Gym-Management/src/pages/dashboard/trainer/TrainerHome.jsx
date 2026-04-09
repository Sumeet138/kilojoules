import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";

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
    { color: "warm", icon: "🏋️", title: "Active Classes", value: activeClasses.length, footer: "Classes you run" },
    { color: "brown", icon: "👥", title: "Total Enrolled", value: totalEnrolled, footer: "Across all classes" },
    { color: "beige", icon: "💺", title: "Total Capacity", value: totalCapacity, footer: "Available spots" },
    { color: "green", icon: "📊", title: "Fill Rate", value: totalCapacity ? `${Math.round((totalEnrolled / totalCapacity) * 100)}%` : "—", footer: "Enrollment rate" },
  ];

  return (
    <div className="mt-4">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Welcome, {trainerData.firstName || "Trainer"} 👋
        </Typography>
        <Typography className="text-gym-text-muted mt-1">
          {trainerData.specialization && `Specialization: ${trainerData.specialization}`}
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

      <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">
        Your Classes
      </Typography>
      {activeClasses.length === 0 ? (
        <Typography className="text-gym-text-muted">No active classes assigned yet.</Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeClasses.map((c) => (
            <div key={c.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
              <Typography variant="h6" className="font-bold text-gym-text-primary mb-1">{c.className}</Typography>
              <span className="text-xs font-semibold bg-gym-beige text-gym-warm-dark px-2 py-1 rounded-full">{c.classType}</span>
              <div className="mt-3 flex flex-col gap-1 text-sm text-gym-text-secondary">
                <span>📅 {c.scheduledDay} at {c.scheduledTime}</span>
                <span>⏱ {c.durationMinutes} min</span>
                <span>👥 {c.currentEnrollment}/{c.capacity} enrolled</span>
              </div>
              <div className="mt-3 w-full bg-gym-beige rounded-full h-2">
                <div
                  className="bg-gym-warm rounded-full h-2 transition-all"
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
