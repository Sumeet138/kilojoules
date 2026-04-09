import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Alert } from "@material-tailwind/react";
import { memberForgotPassword, memberVerifyOtp, memberResetPassword } from "../../API/ApiStore";

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
    <div className="flex justify-center">
      <Card className="w-full max-w-md border border-gym-beige-dark bg-gym-cream shadow-xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🔑</span>
            <Typography variant="h4" className="font-bold text-gym-text-primary mt-2">
              Reset Password
            </Typography>
            <Typography variant="small" className="text-gym-text-muted mt-1">
              {step === STEPS.EMAIL && "Enter your email to receive an OTP"}
              {step === STEPS.OTP && "Enter the OTP sent to your email"}
              {step === STEPS.RESET && "Set your new password"}
              {step === STEPS.DONE && "Password reset successfully!"}
            </Typography>
          </div>

          {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}

          {step === STEPS.EMAIL && (
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                  Email Address
                </Typography>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <Button
                onClick={handleSendOtp}
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === STEPS.OTP && (
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                  OTP Code
                </Typography>
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <Button
                onClick={handleVerifyOtp}
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="text"
                onClick={() => { setStep(STEPS.EMAIL); setOtp(""); }}
                className="text-gym-text-muted"
              >
                Back
              </Button>
            </div>
          )}

          {step === STEPS.RESET && (
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                  New Password
                </Typography>
                <Input
                  type="password"
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">
                  Confirm Password
                </Typography>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <Button
                onClick={handleReset}
                loading={loading}
                fullWidth
                className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}

          {step === STEPS.DONE && (
            <div className="flex flex-col gap-4 text-center">
              <Typography className="text-gym-text-secondary">
                Your password has been updated. You can now sign in.
              </Typography>
              <Button
                onClick={() => navigate("/auth")}
                fullWidth
                className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default ForgotPasswordFlow;
