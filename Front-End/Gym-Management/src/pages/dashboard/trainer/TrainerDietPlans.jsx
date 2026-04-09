import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchDietPlans } from "../../../store/slices/dietPlanSlice";
import { getAllMembers, createDietPlan } from "../../../API/ApiStore";

export default function TrainerDietPlans() {
  const dispatch = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { plans, loading } = useSelector((s) => s.dietPlan);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    memberId: "",
    planName: "",
    description: "",
    totalCalories: "",
    proteinGrams: "",
    carbsGrams: "",
    fatsGrams: "",
  });

  useEffect(() => {
    getAllMembers().then((r) => setMembers(r.data || [])).catch(() => {});
  }, []);

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
      if (form.memberId) dispatch(fetchDietPlans(form.memberId));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to create plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Diet Plans
        </Typography>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white"
        >
          {showForm ? "Cancel" : "+ Create Plan"}
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-6">
        Assign nutrition plans to your members
      </Typography>

      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">New Diet Plan</Typography>
          {error && <Alert color="red" className="mb-3 text-sm">{error}</Alert>}
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

      <Typography className="text-gym-text-muted text-sm">
        Select a member above to view their diet plans, or browse all here.
      </Typography>
    </div>
  );
}
