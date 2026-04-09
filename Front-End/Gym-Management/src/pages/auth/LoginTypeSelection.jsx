import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";

const roles = [
  {
    role: "member",
    label: "Member",
    icon: "🏃",
    desc: "Access your fitness dashboard, book classes, track progress",
    color: "border-gym-warm hover:bg-gym-warm",
  },
  {
    role: "trainer",
    label: "Trainer",
    icon: "🏋️",
    desc: "Manage classes, view your members, track attendance",
    color: "border-gym-brown hover:bg-gym-brown",
  },
  {
    role: "admin",
    label: "Admin",
    icon: "👑",
    desc: "Full control — members, trainers, financials, reports",
    color: "border-gym-accent hover:bg-gym-accent",
  },
];

export function LoginTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="text-center">
        <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">
          Welcome Back
        </Typography>
        <Typography variant="small" className="text-gym-text-muted">
          Select your role to continue
        </Typography>
      </div>

      <div className="w-full flex flex-col gap-3">
        {roles.map(({ role, label, icon, desc, color }) => (
          <button
            key={role}
            onClick={() => navigate(`/auth/${role}/sign-in`)}
            className={`w-full rounded-xl border-2 ${color} bg-gym-cream p-5 text-left transition-all hover:text-white group`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <Typography variant="h6" className="font-bold text-gym-text-primary group-hover:text-white">
                  {label}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted group-hover:text-white/80">
                  {desc}
                </Typography>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Typography variant="small" className="text-gym-text-muted">
        New to GymPro?{" "}
        <button
          onClick={() => navigate("/auth/sign-up")}
          className="font-semibold text-gym-warm hover:underline"
        >
          Register here
        </button>
      </Typography>
    </div>
  );
}

export default LoginTypeSelection;
