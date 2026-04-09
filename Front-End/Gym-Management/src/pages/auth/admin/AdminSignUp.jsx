import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { registerAdmin } from "../../../API/ApiStore";

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

  const InputField = ({ label, name, type = "text", placeholder }) => (
    <div>
      <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
        {label} <span className="text-red-500">*</span>
      </Typography>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required
        className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
        labelProps={{ className: "hidden" }}
      />
    </div>
  );

  return (
    <div className="flex justify-center py-4">
      <Card className="w-full max-w-lg border border-gym-beige-dark bg-gym-cream shadow-xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">👑</span>
            <Typography variant="h4" className="font-bold text-gym-text-primary mt-2">
              Admin Registration
            </Typography>
            <Typography variant="small" className="text-gym-text-muted mt-1">
              Create an admin account
            </Typography>
          </div>

          {error && (
            <Alert color="red" className="mb-4 text-sm">{error}</Alert>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField label="Admin ID" name="adminId" placeholder="e.g. ADM001" />
            </div>
            <InputField label="Username" name="username" placeholder="Choose a username" />
            <InputField label="Password" name="password" type="password" placeholder="Min 8 characters" />
            <InputField label="Email" name="email" type="email" placeholder="admin@gym.com" />
            <InputField label="Phone" name="phone" placeholder="9876543210" />
            <InputField label="First Name" name="firstName" placeholder="John" />
            <InputField label="Last Name" name="lastName" placeholder="Doe" />

            <div className="md:col-span-2">
              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-charcoal to-gym-brown text-white shadow-md"
              >
                {loading ? "Registering..." : "Create Admin Account"}
              </Button>
            </div>
          </form>

          <Typography variant="small" className="text-center text-gym-text-muted mt-6">
            Already have an account?{" "}
            <Link to="/auth/admin/sign-in" className="font-semibold text-gym-charcoal hover:underline">
              Sign in
            </Link>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminSignUp;
