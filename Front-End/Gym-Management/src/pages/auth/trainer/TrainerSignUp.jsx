import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Alert, Textarea } from "@material-tailwind/react";
import { registerTrainer } from "../../../API/ApiStore";

export function TrainerSignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    trainerId: "",
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    specialization: "",
    certificationLevel: "",
    bio: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await registerTrainer(fd);
      navigate("/auth/trainer/sign-in");
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
            <span className="text-4xl">🏋️</span>
            <Typography variant="h4" className="font-bold text-gym-text-primary mt-2">
              Trainer Registration
            </Typography>
            <Typography variant="small" className="text-gym-text-muted mt-1">
              Join our team of fitness professionals
            </Typography>
          </div>

          {error && (
            <Alert color="red" className="mb-4 text-sm">{error}</Alert>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Trainer ID" name="trainerId" placeholder="e.g. TRN001" />
            <InputField label="Username" name="username" placeholder="Choose a username" />
            <InputField label="Email" name="email" type="email" placeholder="your@email.com" />
            <InputField label="Password" name="password" type="password" placeholder="Min 8 characters" />
            <InputField label="First Name" name="firstName" placeholder="John" />
            <InputField label="Last Name" name="lastName" placeholder="Doe" />
            <InputField label="Phone" name="phone" placeholder="9876543210" />
            <InputField label="Specialization" name="specialization" placeholder="e.g. HIIT, Yoga, Strength" />
            <InputField label="Certification Level" name="certificationLevel" placeholder="e.g. Level 3, CPT" required={false} />

            <div className="md:col-span-2">
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Bio
              </Typography>
              <Textarea
                name="bio"
                placeholder="Tell us about your training philosophy and experience..."
                value={form.bio}
                onChange={handleChange}
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-brown to-gym-warm-dark text-white shadow-md"
              >
                {loading ? "Registering..." : "Create Account"}
              </Button>
            </div>
          </form>

          <Typography variant="small" className="text-center text-gym-text-muted mt-6">
            Already have an account?{" "}
            <Link to="/auth/trainer/sign-in" className="font-semibold text-gym-brown hover:underline">
              Sign in
            </Link>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default TrainerSignUp;
