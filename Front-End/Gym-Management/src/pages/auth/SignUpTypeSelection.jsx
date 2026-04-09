import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

const roles = [
  { role: "member", label: "Member", icon: "🏃", desc: "Join as a fitness enthusiast" },
  { role: "trainer", label: "Trainer", icon: "🏋️", desc: "Join as a fitness professional" },
  { role: "admin", label: "Admin", icon: "👑", desc: "Register as gym administrator" },
];

export function SignUpTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="text-center">
        <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">
          Create Account
        </Typography>
        <Typography variant="small" className="text-gym-text-muted">
          Choose your account type
        </Typography>
      </div>
      <div className="w-full flex flex-col gap-3">
        {roles.map(({ role, label, icon, desc }) => (
          <button
            key={role}
            onClick={() => navigate(`/auth/${role}/sign-up`)}
            className="w-full rounded-xl border-2 border-gym-beige-dark bg-gym-cream p-5 text-left transition-all hover:border-gym-warm hover:shadow-md group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <Typography variant="h6" className="font-bold text-gym-text-primary">
                  {label}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted">
                  {desc}
                </Typography>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Typography variant="small" className="text-gym-text-muted">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/auth")}
          className="font-semibold text-gym-warm hover:underline"
        >
          Sign in
        </button>
      </Typography>
    </div>
  );
}

export default SignUpTypeSelection;
