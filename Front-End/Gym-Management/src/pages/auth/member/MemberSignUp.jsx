import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Textarea, Alert } from "@material-tailwind/react";
import { registerMember } from "../../../API/ApiStore";
import { FiUser } from "react-icons/fi";

const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = true }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 mb-1.5 block">
      {label}{required && <span className="text-red-400"> *</span>}
    </label>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="!border-gray-200 focus:!border-orange-400 bg-white"
      labelProps={{ className: "hidden" }}
    />
  </div>
);

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

  return (
    <div className="flex flex-col gap-6 py-2 max-h-[85vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <FiUser className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Member Registration</h2>
          <p className="text-xs text-gray-400">Start your fitness journey today</p>
        </div>
      </div>

      {error && <Alert color="red" className="text-sm">{error}</Alert>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Member ID" name="memberId" placeholder="e.g. MEM001" value={form.memberId} onChange={handleChange} />
        <InputField label="Username" name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} />
        <InputField label="Email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
        <InputField label="Password" name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} />
        <InputField label="First Name" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
        <InputField label="Last Name" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
        <InputField label="Phone" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
        <InputField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
        <InputField label="Age" name="age" type="number" placeholder="25" value={form.age} onChange={handleChange} />

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">
            Gender <span className="text-red-400">*</span>
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <InputField label="Height (cm)" name="heightCm" type="number" placeholder="175" value={form.heightCm} onChange={handleChange} />
        <InputField label="Weight (kg)" name="weightKg" type="number" placeholder="70" value={form.weightKg} onChange={handleChange} />

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Health Conditions</label>
          <Textarea
            name="healthConditions"
            placeholder="Any existing health conditions, injuries, or medical notes..."
            value={form.healthConditions}
            onChange={handleChange}
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Fitness Goals</label>
          <Textarea
            name="fitnessGoals"
            placeholder="e.g. Weight loss, muscle gain, improve stamina..."
            value={form.fitnessGoals}
            onChange={handleChange}
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Trainer Preference</label>
          <Input
            name="trainerPreference"
            placeholder="e.g. Female trainer, HIIT specialist, experienced..."
            value={form.trainerPreference}
            onChange={handleChange}
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
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
        <Link to="/auth/member/sign-in" className="font-semibold text-orange-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default MemberSignUp;
