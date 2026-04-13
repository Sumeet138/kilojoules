import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchDietPlans } from "../../../store/slices/dietPlanSlice";
import { getAllMembers, createDietPlan, deleteDietPlan } from "../../../API/ApiStore";
import { FiFeather } from "react-icons/fi";

const EMPTY_FORM = {
  memberId: "", planName: "", description: "",
  totalCalories: "", proteinGrams: "", carbsGrams: "", fatsGrams: "",
};

export default function TrainerDietPlans() {
  const dispatch = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { plans, loading } = useSelector((s) => s.dietPlan);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getAllMembers().then((r) => setMembers(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedMemberId) dispatch(fetchDietPlans(selectedMemberId));
  }, [dispatch, selectedMemberId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { memberId: mId, ...rest } = form;
      await createDietPlan(mId, trainerId, rest);
      setSuccess("Diet plan created!");
      setShowForm(false);
      setForm(EMPTY_FORM);
      if (mId) dispatch(fetchDietPlans(mId));
      if (mId !== selectedMemberId) setSelectedMemberId(mId);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to create plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this diet plan?")) return;
    try {
      await deleteDietPlan(id);
      if (selectedMemberId) dispatch(fetchDietPlans(selectedMemberId));
      setSuccess("Plan deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete plan.");
    }
  };

  const selectedMember = members.find((m) => String(m.id) === String(selectedMemberId));

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Diet Plans
        </Typography>
        <Button
          size="sm"
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white"
        >
          {showForm ? "Cancel" : "+ Create Plan"}
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-6">
        Assign and manage nutrition plans for your members
      </Typography>

      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}
      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">New Diet Plan</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Member <span className="text-red-500">*</span></Typography>
              <select
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none"
              >
                <option value="">Select member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                ))}
              </select>
            </div>
            {[
              { label: "Plan Name", name: "planName", placeholder: "e.g. High Protein Plan" },
              { label: "Description", name: "description", placeholder: "Brief description" },
              { label: "Calories (kcal)", name: "totalCalories", type: "number", placeholder: "2000" },
              { label: "Protein (g)", name: "proteinGrams", type: "number", placeholder: "150" },
              { label: "Carbs (g)", name: "carbsGrams", type: "number", placeholder: "200" },
              { label: "Fats (g)", name: "fatsGrams", type: "number", placeholder: "70" },
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
          </div>
          <Button type="submit" loading={submitting} fullWidth className="mt-4 bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white">
            {submitting ? "Creating..." : "Create Diet Plan"}
          </Button>
        </form>
      )}

      {/* Member selector to view plans */}
      <div className="flex items-center gap-3 mb-5">
        <Typography variant="small" className="font-medium text-gym-text-primary whitespace-nowrap">
          View plans for:
        </Typography>
        <select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none text-sm"
        >
          <option value="">Select a member...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
          ))}
        </select>
      </div>

      {selectedMemberId && (
        <>
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">
            Plans for {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : "Member"}
          </Typography>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gym-warm border-t-transparent" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-10 text-gym-text-muted">
              <FiFeather className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              No diet plans for this member yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <Typography variant="h6" className="font-bold text-gym-text-primary">
                      {plan.planName}
                    </Typography>
                    <Button
                      size="sm"
                      variant="text"
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-500 p-0"
                    >
                      Delete
                    </Button>
                  </div>
                  <Typography variant="small" className="text-gym-text-muted mb-4">
                    {plan.description}
                  </Typography>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Calories", value: plan.totalCalories, unit: "kcal", color: "bg-orange-50 text-orange-700" },
                      { label: "Protein", value: plan.proteinGrams, unit: "g", color: "bg-blue-50 text-blue-700" },
                      { label: "Carbs", value: plan.carbsGrams, unit: "g", color: "bg-yellow-50 text-yellow-700" },
                      { label: "Fats", value: plan.fatsGrams, unit: "g", color: "bg-red-50 text-red-700" },
                    ].map(({ label, value, unit, color }) => (
                      <div key={label} className={`rounded-lg p-3 ${color}`}>
                        <Typography variant="small" className="font-medium">{label}</Typography>
                        <Typography variant="h6" className="font-bold">
                          {value ?? "—"} <span className="text-xs font-normal">{unit}</span>
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
