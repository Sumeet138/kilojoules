import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchMemberById } from "../../../store/slices/memberSlice";
import { updateMember } from "../../../API/ApiStore";

export default function MemberProfile() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { currentMember, loading } = useSelector((s) => s.member);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    if (memberId) dispatch(fetchMemberById(memberId));
  }, [dispatch, memberId]);

  useEffect(() => {
    if (currentMember) setForm({ ...currentMember });
  }, [currentMember]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateMember(memberId, form);
      dispatch(fetchMemberById(memberId));
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !currentMember) {
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
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Height (cm)", name: "heightCm", type: "number" },
    { label: "Weight (kg)", name: "weightKg", type: "number" },
    { label: "Health Conditions", name: "healthConditions" },
    { label: "Fitness Goals", name: "fitnessGoals" },
    { label: "Trainer Preference", name: "trainerPreference" },
  ];

  return (
    <div className="mt-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          My Profile
        </Typography>
        <Button
          size="sm"
          onClick={() => { setEditing(!editing); setError(""); }}
          variant={editing ? "outlined" : "filled"}
          className={editing ? "border-gym-warm text-gym-warm" : "bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}
      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      {/* Avatar block */}
      <div className="flex items-center gap-4 bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gym-warm flex items-center justify-center text-2xl text-white font-bold">
          {currentMember.firstName?.[0]}{currentMember.lastName?.[0]}
        </div>
        <div>
          <Typography variant="h5" className="font-bold text-gym-text-primary">
            {currentMember.firstName} {currentMember.lastName}
          </Typography>
          <Typography variant="small" className="text-gym-text-muted">
            Member ID: {currentMember.memberId}
          </Typography>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {currentMember[name] || "—"}
                </Typography>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <Button
            type="submit"
            loading={saving}
            fullWidth
            className="mt-5 bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </form>
    </div>
  );
}
