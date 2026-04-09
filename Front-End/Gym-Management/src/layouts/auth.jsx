import { Outlet } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export function Auth() {
  return (
    <div className="relative min-h-screen bg-gym-beige">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gym-warm/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gym-brown/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏋️</span>
            <Typography variant="h3" className="font-bold text-gym-brown">
              GymPro
            </Typography>
          </div>
          <Typography variant="small" className="text-gym-text-muted">
            Fitness Center Management System
          </Typography>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
