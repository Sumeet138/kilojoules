import { useEffect, useState } from "react";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { getAllPlans, createMembershipPlan, updateMembershipPlan, deactivateMembershipPlan } from "../../../API/ApiStore";

const PLAN_TYPES = ["MONTHLY", "QUARTERLY", "ANNUAL"];

const EMPTY_FORM = { planName: "", planType: "MONTHLY", price: "", durationDays: "", description: "" };

export default function AdminMemberships() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    getAllPlans()
      .then((r) => setPlans(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(""); };
  const openEdit = (p) => {
    setForm({ planName: p.planName, planType: p.planType, price: String(p.price), durationDays: String(p.durationDays), description: p.description || "" });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), durationDays: Number(form.durationDays) };
      if (editingId) {
        await updateMembershipPlan(editingId, payload);
        setSuccess("Plan updated!");
      } else {
        await createMembershipPlan(payload);
        setSuccess("Plan created!");
      }
      load();
      setShowForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this plan?")) return;
    try {
      await deactivateMembershipPlan(id);
      setSuccess("Plan deactivated.");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to deactivate plan.");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Membership Plans</Typography>
        <Button size="sm" onClick={openCreate} className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
          + Add Plan
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-5">Create and manage membership subscription plans</Typography>

      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}
      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            {editingId ? "Edit Plan" : "New Membership Plan"}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Plan Name *</Typography>
              <Input name="planName" placeholder="e.g. Gold Monthly" value={form.planName} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Plan Type *</Typography>
              <select name="planType" value={form.planType} onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none">
                {PLAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Price (₹) *</Typography>
              <Input type="number" name="price" placeholder="999" value={form.price} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Duration (days) *</Typography>
              <Input type="number" name="durationDays" placeholder="30" value={form.durationDays} onChange={handleChange} required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">Description</Typography>
              <Input name="description" placeholder="What's included in this plan..." value={form.description} onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white" labelProps={{ className: "hidden" }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button type="submit" loading={submitting} className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
              {submitting ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className={`bg-gym-cream border rounded-xl p-5 shadow-sm ${p.isActive ? "border-gym-beige-dark" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Typography variant="h6" className="font-bold text-gym-text-primary">{p.planName}</Typography>
                  <span className="text-xs font-semibold bg-gym-beige text-gym-warm-dark px-2 py-1 rounded-full">{p.planType}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <Typography variant="h4" className="font-bold text-gym-warm mb-1">₹{p.price}</Typography>
              <Typography variant="small" className="text-gym-text-muted">{p.durationDays} days</Typography>
              {p.description && (
                <Typography variant="small" className="text-gym-text-secondary mt-2 block">{p.description}</Typography>
              )}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="text" onClick={() => openEdit(p)} className="text-gym-warm p-0">Edit</Button>
                {p.isActive && (
                  <Button size="sm" variant="text" onClick={() => handleDeactivate(p.id)} className="text-red-500 p-0">Deactivate</Button>
                )}
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <Typography className="text-gym-text-muted col-span-3 text-center py-10">No plans yet. Create one!</Typography>
          )}
        </div>
      )}
    </div>
  );
}
