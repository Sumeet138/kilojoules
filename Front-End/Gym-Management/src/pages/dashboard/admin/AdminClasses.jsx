import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchFitnessClasses } from "../../../store/slices/fitnessClassSlice";
import { fetchAllTrainers } from "../../../store/slices/trainerSlice";
import { createFitnessClass, updateFitnessClass } from "../../../API/ApiStore";

const CLASS_TYPES = ["YOGA", "HIIT", "ZUMBA", "CROSSFIT", "PILATES", "SPINNING", "BOXING", "STRENGTH"];
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const EMPTY_FORM = {
  className: "", classType: "YOGA", trainerId: "", scheduledDay: "MONDAY",
  scheduledTime: "09:00", durationMinutes: "60", capacity: "20",
};

export default function AdminClasses() {
  const dispatch = useDispatch();
  const { classes, loading } = useSelector((s) => s.fitnessClass);
  const { trainers } = useSelector((s) => s.trainer);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchFitnessClasses());
    dispatch(fetchAllTrainers());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(""); };
  const openEdit = (fc) => {
    setForm({
      className: fc.className, classType: fc.classType,
      trainerId: fc.trainer?.id || "", scheduledDay: fc.scheduledDay,
      scheduledTime: fc.scheduledTime, durationMinutes: String(fc.durationMinutes),
      capacity: String(fc.capacity),
    });
    setEditingId(fc.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const trainerId = form.trainerId ? Number(form.trainerId) : null;
      const payload = {
        className: form.className,
        classType: form.classType,
        scheduledDay: form.scheduledDay,
        scheduledTime: form.scheduledTime,
        durationMinutes: Number(form.durationMinutes),
        capacity: Number(form.capacity),
      };
      if (editingId) {
        await updateFitnessClass(editingId, payload, trainerId);
        setSuccess("Class updated!");
      } else {
        // createFitnessClass uses multipart/form-data per the controller
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
        if (trainerId) fd.append("trainerId", trainerId);
        await createFitnessClass(fd);
        setSuccess("Class created!");
      }
      dispatch(fetchFitnessClasses());
      setShowForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Fitness Classes</Typography>
        <Button size="sm" onClick={openCreate} className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
          + Add Class
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-5">Manage all gym fitness classes</Typography>

      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            {editingId ? "Edit Class" : "New Fitness Class"}
          </Typography>
          {error && <Alert color="red" className="mb-3 text-sm">{error}</Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Class Name */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Class Name *</Typography>
              <Input name="className" placeholder="e.g. Morning HIIT" value={form.className} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            {/* Class Type */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Class Type *</Typography>
              <select name="classType" value={form.classType} onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none">
                {CLASS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Trainer */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Trainer</Typography>
              <select name="trainerId" value={form.trainerId} onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none">
                <option value="">No trainer</option>
                {trainers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
            {/* Scheduled Day */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Day *</Typography>
              <select name="scheduledDay" value={form.scheduledDay} onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none">
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Time */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Time *</Typography>
              <Input type="time" name="scheduledTime" value={form.scheduledTime} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            {/* Duration */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Duration (min) *</Typography>
              <Input type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} required
                placeholder="60" className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            {/* Capacity */}
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Capacity *</Typography>
              <Input type="number" name="capacity" value={form.capacity} onChange={handleChange} required
                placeholder="20" className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button type="submit" loading={submitting} className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
              {submitting ? "Saving..." : editingId ? "Update Class" : "Create Class"}
            </Button>
            <Button type="button" variant="outlined" onClick={() => setShowForm(false)}
              className="border-gym-beige-dark text-gym-text-secondary">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Class", "Type", "Trainer", "Day", "Time", "Duration", "Enrolled", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((fc, idx) => (
                <tr key={fc.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 font-medium text-gym-text-primary">{fc.className}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{fc.classType}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">
                    {fc.trainer ? `${fc.trainer.firstName} ${fc.trainer.lastName}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gym-text-secondary">{fc.scheduledDay}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{fc.scheduledTime}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{fc.durationMinutes} min</td>
                  <td className="px-4 py-3">{fc.currentEnrollment}/{fc.capacity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fc.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {fc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="text" onClick={() => openEdit(fc)} className="text-gym-warm p-0">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gym-text-muted">No classes yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
