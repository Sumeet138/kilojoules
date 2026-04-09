import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchWorkouts } from "../../../store/slices/workoutHistorySlice";
import { logWorkout } from "../../../API/ApiStore";

export default function WorkoutHistory() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { workouts, loading } = useSelector((s) => s.workoutHistory);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    exerciseName: "",
    sets: "",
    reps: "",
    weightKg: "",
    durationMinutes: "",
    workoutDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (memberId) dispatch(fetchWorkouts(memberId));
  }, [dispatch, memberId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await logWorkout(memberId, form);
      dispatch(fetchWorkouts(memberId));
      setShowForm(false);
      setForm({ exerciseName: "", sets: "", reps: "", weightKg: "", durationMinutes: "", workoutDate: new Date().toISOString().split("T")[0], notes: "" });
    } catch (err) {
      setError(err.response?.data || "Failed to log workout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Workout History
        </Typography>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
        >
          {showForm ? "Cancel" : "+ Log Workout"}
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-6">
        Track every rep and set
      </Typography>

      {showForm && (
        <form onSubmit={handleLog} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">Log a Workout</Typography>
          {error && <Alert color="red" className="mb-3 text-sm">{error}</Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Exercise Name", name: "exerciseName", placeholder: "e.g. Bench Press" },
              { label: "Date", name: "workoutDate", type: "date" },
              { label: "Sets", name: "sets", type: "number", placeholder: "3" },
              { label: "Reps", name: "reps", type: "number", placeholder: "10" },
              { label: "Weight (kg)", name: "weightKg", type: "number", placeholder: "60" },
              { label: "Duration (min)", name: "durationMinutes", type: "number", placeholder: "45" },
            ].map(({ label, name, type = "text", placeholder }) => (
              <div key={name}>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">{label}</Typography>
                <Input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Notes</Typography>
              <Input
                name="notes"
                placeholder="Optional notes..."
                value={form.notes}
                onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
              />
            </div>
          </div>
          <Button type="submit" loading={submitting} className="mt-4 bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white" fullWidth>
            {submitting ? "Saving..." : "Save Workout"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <span className="text-5xl block mb-3">💪</span>
          No workouts logged yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workouts.map((w) => (
            <div key={w.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="h6" className="font-bold text-gym-text-primary">{w.exerciseName}</Typography>
                <Typography variant="small" className="text-gym-text-muted">{w.workoutDate}</Typography>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-gym-beige px-2 py-1 rounded-full text-gym-text-secondary">{w.sets} sets</span>
                <span className="bg-gym-beige px-2 py-1 rounded-full text-gym-text-secondary">{w.reps} reps</span>
                {w.weightKg && <span className="bg-gym-beige px-2 py-1 rounded-full text-gym-text-secondary">{w.weightKg}kg</span>}
                {w.durationMinutes && <span className="bg-gym-beige px-2 py-1 rounded-full text-gym-text-secondary">{w.durationMinutes}min</span>}
              </div>
              {w.notes && (
                <Typography variant="small" className="text-gym-text-muted mt-2">{w.notes}</Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
