import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardBody, Typography, Input, Button, Alert, Textarea } from "@material-tailwind/react";
import { registerTrainerThunk } from "../../../store/slices/trainerSlice";
import { FiActivity } from "react-icons/fi";

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
      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
        {label}{required && <span className="text-red-400"> *</span>}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="!border-gray-200 focus:!border-orange-400 bg-white"
        labelProps={{ className: "hidden" }}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 py-2 max-h-[85vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <FiActivity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Trainer Registration</h2>
          <p className="text-xs text-gray-400">Join our team of fitness professionals</p>
        </div>
      </div>

      {error && <Alert color="red" className="text-sm">{error}</Alert>}

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
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Bio</label>
          <Textarea
            name="bio"
            placeholder="Tell us about your training philosophy and experience..."
            value={form.bio}
            onChange={handleChange}
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md rounded-xl"
          >
            {loading ? "Registering..." : "Create Account"}
          </Button>
        </div>
      </form>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{" "}
        <Link to="/auth/trainer/sign-in" className="font-semibold text-orange-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default TrainerSignUp;
