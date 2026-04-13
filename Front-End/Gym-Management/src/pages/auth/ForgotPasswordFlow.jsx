import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { memberForgotPassword, memberVerifyOtp, memberResetPassword } from "../../API/ApiStore";
import { FiLock } from "react-icons/fi";

const STEPS = { EMAIL: "email", OTP: "otp", RESET: "reset", DONE: "done" };

export function ForgotPasswordFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const wrap = async (fn) => {
    setLoading(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () =>
    wrap(async () => {
      await memberForgotPassword(email);
      setStep(STEPS.OTP);
    });

  const handleVerifyOtp = () =>
    wrap(async () => {
      await memberVerifyOtp(email, otp);
      setStep(STEPS.RESET);
    });

  const handleReset = () =>
    wrap(async () => {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      await memberResetPassword({ email, otp, newPassword });
      setStep(STEPS.DONE);
    });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <FiLock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Reset Password</h2>
          <p className="text-xs text-gray-400">
            {step === STEPS.EMAIL && "Enter your email to receive an OTP"}
            {step === STEPS.OTP && "Enter the OTP sent to your email"}
            {step === STEPS.RESET && "Set your new password"}
            {step === STEPS.DONE && "Password reset successfully!"}
          </p>
        </div>
      </div>

      {error && <Alert color="red" className="text-sm">{error}</Alert>}

      {step === STEPS.EMAIL && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email Address</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-gray-200 focus:!border-orange-400 bg-white"
              labelProps={{ className: "hidden" }}
            />
          </div>
          <Button
            onClick={handleSendOtp}
            loading={loading}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      )}

      {step === STEPS.OTP && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">OTP Code</label>
            <Input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="!border-gray-200 focus:!border-orange-400 bg-white"
              labelProps={{ className: "hidden" }}
            />
          </div>
          <Button
            onClick={handleVerifyOtp}
            loading={loading}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <button
            onClick={() => { setStep(STEPS.EMAIL); setOtp(""); }}
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {step === STEPS.RESET && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">New Password</label>
            <Input
              type="password"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="!border-gray-200 focus:!border-orange-400 bg-white"
              labelProps={{ className: "hidden" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Confirm Password</label>
            <Input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="!border-gray-200 focus:!border-orange-400 bg-white"
              labelProps={{ className: "hidden" }}
            />
          </div>
          <Button
            onClick={handleReset}
            loading={loading}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      )}

      {step === STEPS.DONE && (
        <div className="flex flex-col gap-5 text-center">
          <p className="text-sm text-gray-500">
            Your password has been updated. You can now sign in.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl"
          >
            Go to Login
          </Button>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordFlow;
