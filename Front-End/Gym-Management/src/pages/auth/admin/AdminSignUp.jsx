import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { registerAdminThunk } from "../../../store/slices/adminSlice";
import { FiShield } from "react-icons/fi";

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

export function AdminSignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    adminId: "",
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await registerAdmin(fd);
      navigate("/auth/admin/sign-in");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <FiShield className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Admin Registration</h2>
          <p className="text-xs text-gray-400">Create an admin account</p>
        </div>
      </div>

      {error && <Alert color="red" className="text-sm">{error}</Alert>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <InputField label="Admin ID" name="adminId" placeholder="e.g. ADM001" value={form.adminId} onChange={handleChange} />
        </div>
        <InputField label="Username" name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} />
        <InputField label="Password" name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} />
        <InputField label="Email" name="email" type="email" placeholder="admin@gym.com" value={form.email} onChange={handleChange} />
        <InputField label="Phone" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
        <InputField label="First Name" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
        <InputField label="Last Name" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />

        <div className="md:col-span-2">
          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md rounded-xl"
          >
            {loading ? "Registering..." : "Create Admin Account"}
          </Button>
        </div>
      </form>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{" "}
        <Link to="/auth/admin/sign-in" className="font-semibold text-orange-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default AdminSignUp;
