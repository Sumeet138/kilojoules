import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Alert } from "@material-tailwind/react";
import { fetchTrainerClasses } from "../../../store/slices/fitnessClassSlice";
import { updateFitnessClass } from "../../../API/ApiStore";
import { FiCalendar, FiEdit2, FiX, FiCheck, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

export default function TrainerClasses() {
  const dispatch  = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { trainerClasses, loading } = useSelector((s) => s.fitnessClass);

  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving,   setSaving]   = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerClasses(trainerId));
  }, [dispatch, trainerId]);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  };

  const startEdit = (c) => {
    setEditId(c.id);
    setEditForm({
      className:      c.className,
      classType:      c.classType,
      scheduledDay:   c.scheduledDay,
      scheduledTime:  c.scheduledTime,
      durationMinutes: c.durationMinutes,
      capacity:       c.capacity,
      description:    c.description || "",
      price:          c.price ?? 500,
      isActive:       c.isActive,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFitnessClass(editId, editForm);
      flash("green", "Class updated successfully.");
      setEditId(null);
      dispatch(fetchTrainerClasses(trainerId));
    } catch {
      flash("red", "Failed to update class.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c) => {
    setTogglingId(c.id);
    try {
      await updateFitnessClass(c.id, { ...c, isActive: !c.isActive });
      flash("green", `Class marked as ${!c.isActive ? "Active" : "Inactive"}.`);
      dispatch(fetchTrainerClasses(trainerId));
    } catch {
      flash("red", "Failed to toggle status.");
    } finally {
      setTogglingId(null);
    }
  };

  const field = (label, key, type = "text", extra = {}) => (
    <div key={key}>
      <p className="text-xs text-gym-text-muted mb-0.5">{label}</p>
      <input
        type={type}
        value={editForm[key]}
        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
        className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-1.5 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none"
        {...extra}
      />
    </div>
  );

  const active = trainerClasses.filter((c) => c.isActive).length;
  const total  = trainerClasses.length;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <Typography variant="h4" className="font-bold text-gym-text-primary">My Classes</Typography>
        <div className="text-xs text-gym-text-muted font-medium">
          {active} active · {total - active} inactive · {total} total
        </div>
      </div>
      <Typography className="text-gym-text-muted mb-5">Manage the fitness classes assigned to you</Typography>

      {msg.text && <Alert color={msg.type} className="mb-4 text-sm">{msg.text}</Alert>}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : trainerClasses.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiCalendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No classes assigned yet. Ask your admin to assign classes.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {trainerClasses.map((c) => {
            const fillPct = c.capacity > 0 ? Math.round((c.currentEnrollment / c.capacity) * 100) : 0;
            const isEditing = editId === c.id;

            return (
              <div key={c.id} className={`bg-gym-cream border rounded-xl shadow-sm overflow-hidden transition-all ${c.isActive ? "border-gym-beige-dark" : "border-gray-200 opacity-70"}`}>
                {/* Header row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gym-text-primary">{c.className}</span>
                      <span className="text-xs bg-gym-beige px-2 py-0.5 rounded-full text-gym-text-secondary">{c.classType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gym-text-muted mt-0.5">
                      {c.scheduledDay} · {c.scheduledTime} · {c.durationMinutes} min · ₹{c.price ?? 500}
                    </p>
                    {c.description && <p className="text-xs text-gym-text-muted mt-0.5 truncate max-w-md">{c.description}</p>}
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => handleToggleActive(c)}
                      disabled={togglingId === c.id}
                      title={c.isActive ? "Mark Inactive" : "Mark Active"}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${c.isActive ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                    >
                      {c.isActive ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => isEditing ? setEditId(null) : startEdit(c)}
                      className={`p-1.5 rounded-lg transition-colors ${isEditing ? "text-red-400 hover:bg-red-50" : "text-gray-400 hover:text-gym-warm hover:bg-gym-beige"}`}
                    >
                      {isEditing ? <FiX className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Enrollment bar */}
                <div className="px-5 pb-3">
                  <div className="flex items-center justify-between text-xs text-gym-text-muted mb-1">
                    <span>Enrolled: {c.currentEnrollment}/{c.capacity}</span>
                    <span>{fillPct}%</span>
                  </div>
                  <div className="h-1.5 bg-gym-beige rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-400" : fillPct >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Inline edit panel */}
                {isEditing && (
                  <div className="border-t border-gym-beige-dark bg-white px-5 py-4">
                    <p className="text-sm font-semibold text-gym-text-primary mb-3">Edit Class Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      {field("Class Name", "className")}
                      <div>
                        <p className="text-xs text-gym-text-muted mb-0.5">Day</p>
                        <select
                          value={editForm.scheduledDay}
                          onChange={(e) => setEditForm({ ...editForm, scheduledDay: e.target.value })}
                          className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-1.5 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none"
                        >
                          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      {field("Time (HH:mm)", "scheduledTime")}
                      {field("Duration (min)", "durationMinutes", "number")}
                      {field("Capacity", "capacity", "number")}
                      {field("Price (₹)", "price", "number")}
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gym-text-muted mb-0.5">Description</p>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-1.5 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                      >
                        <FiCheck className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiX className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
