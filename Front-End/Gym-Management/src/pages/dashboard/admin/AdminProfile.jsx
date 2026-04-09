import { useEffect, useState } from "react";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { getAdminById, updateAdmin } from "../../../API/ApiStore";

export default function AdminProfile() {
  const adminId = localStorage.getItem("adminId");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});

  const load = () => {
    if (!adminId) return;
    setLoading(true);
    getAdminById(adminId)
      .then((r) => { setAdmin(r.data); setForm(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [adminId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateAdmin(adminId, form);
      load();
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !admin) {
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
  ];

  return (
    <div className="mt-4 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Admin Profile</Typography>
        <Button
          size="sm"
          onClick={() => { setEditing(!editing); setError(""); }}
          variant={editing ? "outlined" : "filled"}
          className={editing
            ? "border-gym-charcoal text-gym-charcoal"
            : "bg-gradient-to-r from-gym-charcoal to-gym-brown text-white"}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}
      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      <div className="flex items-center gap-4 bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gym-charcoal flex items-center justify-center text-2xl text-white font-bold">
          {admin.firstName?.[0]}{admin.lastName?.[0]}
        </div>
        <div>
          <Typography variant="h5" className="font-bold text-gym-text-primary">
            {admin.firstName} {admin.lastName}
          </Typography>
          <Typography variant="small" className="text-gym-text-muted">
            Admin ID: {admin.adminId}
          </Typography>
          <span className="text-xs bg-gym-charcoal text-white px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
            Administrator
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {fields.map(({ label, name, type = "text" }) => (
            <div key={name}>
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
                  {admin[name] || "—"}
                </Typography>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <Button type="submit" loading={saving} fullWidth
            className="mt-5 bg-gradient-to-r from-gym-charcoal to-gym-brown text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>
    </div>
  );
}
