import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { loginAdminThunk } from "../../../store/slices/adminSlice";

export function AdminSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin);

  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdminThunk(form));
    if (loginAdminThunk.fulfilled.match(result)) {
      navigate("/dashboard/admin/home");
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md border border-gym-beige-dark bg-gym-cream shadow-xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">👑</span>
            <Typography variant="h4" className="font-bold text-gym-text-primary mt-2">
              Admin Login
            </Typography>
            <Typography variant="small" className="text-gym-text-muted mt-1">
              Full control of the gym system
            </Typography>
          </div>

          {error && (
            <Alert color="red" className="mb-4 text-sm">
              {typeof error === "string" ? error : "Invalid credentials. Please try again."}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Username
              </Typography>
              <Input
                name="username"
                placeholder="Enter admin username"
                value={form.username}
                onChange={handleChange}
                required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div>
              <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                Password
              </Typography>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                labelProps={{ className: "hidden" }}
              />
            </div>

            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-sm text-gym-warm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="bg-gradient-to-r from-gym-charcoal to-gym-brown text-white shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminSignIn;
