import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { loginAdminThunk } from "../../../store/slices/adminSlice";
import { SignInAutoFillButton } from "../../../components/TestAutoFillButton";
import { FiShield } from "react-icons/fi";

export function AdminSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin);

  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAutoFill = (credentials) => {
    setForm(credentials);
  };

  const handleQuickLogin = async (credentials) => {
    const result = await dispatch(loginAdminThunk(credentials));
    if (loginAdminThunk.fulfilled.match(result)) {
      navigate("/dashboard/admin/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdminThunk(form));
    if (loginAdminThunk.fulfilled.match(result)) {
      navigate("/dashboard/admin/home");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <FiShield className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Admin Login</h2>
          <p className="text-xs text-gray-400">Full control of the gym system</p>
        </div>
      </div>

      {error && (
        <Alert color="red" className="text-sm">
          {typeof error === "string" ? error : "Invalid credentials. Please try again."}
        </Alert>
      )}

      <div className="flex justify-end">
        <SignInAutoFillButton onFill={handleAutoFill} onQuickLogin={handleQuickLogin} role="admin" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username</label>
          <Input
            name="username"
            placeholder="Enter admin username"
            value={form.username}
            onChange={handleChange}
            required
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="!border-gray-200 focus:!border-orange-400 bg-white"
            labelProps={{ className: "hidden" }}
          />
        </div>

        <div className="flex justify-end">
          <Link to="/auth/forgot-password" className="text-xs text-orange-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg transition-all rounded-xl"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-sm text-gray-400 text-center">
        Don't have an account?{" "}
        <Link to="/auth/admin/sign-up" className="font-semibold text-orange-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default AdminSignIn;
