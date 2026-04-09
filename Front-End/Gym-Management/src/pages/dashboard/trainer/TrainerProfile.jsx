import { useEffect, useState } from "react";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { getTrainerById, updateTrainer } from "../../../API/ApiStore";

export default function TrainerProfile() {
  const trainerId = localStorage.getItem("trainerId");
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!trainerId) return;
    setLoading(true);
    getTrainerById(trainerId)
      .then((r) => { setTrainer(r.data); setForm(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [trainerId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateTrainer(trainerId, form);
      const r = await getTrainerById(trainerId);
      setTrainer(r.data);
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !trainer) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
      </div>
    );
  }

  const fields = [
    { label: "First Name", name: "firstName" },
    { label: "Last Name", name: "lastName" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone" },
    { label: "Specialization", name: "specialization" },
    { label: "Certification Level", name: "certificationLevel" },
    { label: "Bio", name: "bio" },
  ];

  return (
    <div className="mt-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">My Profile</Typography>
        <Button
          size="sm"
          onClick={() => { setEditing(!editing); setError(""); }}
          variant={editing ? "outlined" : "filled"}
          className={editing ? "border-gym-brown text-gym-brown" : "bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white"}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}
      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      <div className="flex items-center gap-4 bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gym-brown flex items-center justify-center text-2xl text-white font-bold">
          {trainer.firstName?.[0]}{trainer.lastName?.[0]}
        </div>
        <div>
          <Typography variant="h5" className="font-bold text-gym-text-primary">
            {trainer.firstName} {trainer.lastName}
          </Typography>
          <Typography variant="small" className="text-gym-text-muted">
            Trainer ID: {trainer.trainerId} · {trainer.specialization}
          </Typography>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ label, name, type = "text" }) => (
            <div key={name} className={name === "bio" ? "md:col-span-2" : ""}>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">{label}</Typography>
              {editing ? (
                <Input
                  type={type}
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              ) : (
                <Typography className="text-gym-text-secondary border-b border-gym-beige-dark pb-1">
                  {trainer[name] || "—"}
                </Typography>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <Button type="submit" loading={saving} fullWidth className="mt-5 bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>
    </div>
  );
}
