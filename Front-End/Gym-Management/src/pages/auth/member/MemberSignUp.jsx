import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Select, Option, Textarea, Alert } from "@material-tailwind/react";
import { registerMember } from "../../../API/ApiStore";

export function MemberSignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    memberId: "",
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    age: "",
    gender: "MALE",
    heightCm: "",
    weightKg: "",
    healthConditions: "",
    fitnessGoals: "",
    trainerPreference: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await registerMember(fd);
      navigate("/auth/member/sign-in");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, required = true }) => (
    <div>
      <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </Typography>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
        labelProps={{ className: "hidden" }}
      />
    </div>
  );

  return (
    <div className="flex justify-center py-4">
      <Card className="w-full max-w-2xl border border-gym-beige-dark bg-gym-cream shadow-xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🏃</span>
            <Typography variant="h4" className="font-bold text-gym-text-primary mt-2">
              Member Registration
            </Typography>
            <Typography variant="small" className="text-gym-text-muted mt-1">
              Start your fitness journey today
            </Typography>
          </div>

          {error && (
            <Alert color="red" className="mb-4 text-sm">{error}</Alert>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Member ID" name="memberId" placeholder="e.g. MEM001" />
            <InputField label="Username" name="username" placeholder="Choose a username" />
            <InputField label="Email" name="email" type="email" placeholder="your@email.com" />
            <InputField label="Password" name="password" type="password" placeholder="Min 8 characters" />
            <InputField label="First Name" name="firstName" placeholder="John" />
            <InputField label="Last Name" name="lastName" placeholder="Doe" />
            <InputField label="Phone" name="phone" placeholder="9876543210" />
            <InputField label="Date of Birth" name="dob" type="date" />
            <InputField label="Age" name="age" type="number" placeholder="25" />

            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Gender <span className="text-red-500">*</span>
              </Typography>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <InputField label="Height (cm)" name="heightCm" type="number" placeholder="175" />
            <InputField label="Weight (kg)" name="weightKg" type="number" placeholder="70" />

            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Health Conditions
              </Typography>
              <Textarea
                name="healthConditions"
                placeholder="Any existing health conditions, injuries, or medical notes..."
                value={form.healthConditions}
                onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Fitness Goals
              </Typography>
              <Textarea
                name="fitnessGoals"
                placeholder="e.g. Weight loss, muscle gain, improve stamina..."
                value={form.fitnessGoals}
                onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Trainer Preference
              </Typography>
              <Input
                name="trainerPreference"
                placeholder="e.g. Female trainer, HIIT specialist, experienced..."
                value={form.trainerPreference}
                onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white shadow-md"
              >
                {loading ? "Registering..." : "Create Account"}
              </Button>
            </div>
          </form>

          <Typography variant="small" className="text-center text-gym-text-muted mt-6">
            Already have an account?{" "}
            <Link to="/auth/member/sign-in" className="font-semibold text-gym-warm hover:underline">
              Sign in
            </Link>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default MemberSignUp;
