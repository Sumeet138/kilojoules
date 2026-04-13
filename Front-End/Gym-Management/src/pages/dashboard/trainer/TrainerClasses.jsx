import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";
import { FiCalendar } from "react-icons/fi";

export default function TrainerClasses() {
  const dispatch = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { trainerClasses, loading } = useSelector((s) => s.fitnessClass);

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerClasses(trainerId));
  }, [dispatch, trainerId]);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        My Classes
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        All fitness classes assigned to you
      </Typography>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : trainerClasses.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiCalendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No classes assigned yet.
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Class Name", "Type", "Day", "Time", "Duration", "Enrolled", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainerClasses.map((c, idx) => (
                <tr key={c.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 font-medium text-gym-text-primary">{c.className}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{c.classType}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{c.scheduledDay}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{c.scheduledTime}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{c.durationMinutes} min</td>
                  <td className="px-4 py-3">{c.currentEnrollment}/{c.capacity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {c.isActive ? "Active" : "Inactive"}
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
