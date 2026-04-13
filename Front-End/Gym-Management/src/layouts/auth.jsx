import { Outlet, Link } from "react-router-dom";
import { FiZap, FiTarget, FiTrendingUp, FiUsers, FiMap } from "react-icons/fi";

export function Auth() {
  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/40 to-amber-50/30">
      {/* Soft blurred blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-amber-200/20 blur-[100px]" />
      </div>

      {/* ─── Left panel: hero ─── */}
      <div className="relative z-10 hidden lg:flex lg:w-[52%] flex-col justify-between gap-6 p-10 xl:p-14 overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25">
            <FiZap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Kilojoules</span>
        </div>

        {/* Hero copy + illustration */}
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-gray-900">
            Welcome to our<br />
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Fitness Community
            </span>
          </h1>
          <p className="max-w-md text-sm text-gray-500 leading-relaxed">
            A whole new productive fitness journey starts right here.
            Track workouts, book classes, manage teams — all in one place.
          </p>

          {/* Illustration */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=720&q=80&auto=format&fit=crop"
              alt="Modern gym interior"
              className="w-full rounded-2xl object-cover shadow-xl shadow-orange-900/10 aspect-[16/10]"
            />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { Icon: FiTarget, text: "Goal Tracking" },
              { Icon: FiTrendingUp, text: "Progress Analytics" },
              { Icon: FiUsers, text: "Team Management" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 backdrop-blur px-3 py-1">
                <Icon className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs font-medium text-gray-600">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
          <span>&copy; {new Date().getFullYear()} Kilojoules</span>
          <span className="text-gray-200">|</span>
          <Link to="/system-design" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <FiMap className="h-3 w-3" /> System Design
          </Link>
        </div>
      </div>

      {/* ─── Right panel: form ─── */}
      <div className="relative z-10 flex flex-1 flex-col lg:w-[48%]">
        {/* Mobile brand bar */}
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md">
            <FiZap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Kilojoules</span>
        </div>

        {/* Centered form area */}
        <div className="flex flex-1 items-center justify-center px-6 pb-10 lg:px-10 xl:px-16">
          <div className="w-full max-w-lg">
            <Outlet />
          </div>
        </div>

        {/* Mobile footer */}
        <div className="flex items-center justify-center gap-4 pb-6 text-xs text-gray-400 lg:hidden">
          <span>&copy; {new Date().getFullYear()} Kilojoules</span>
          <Link to="/system-design" className="flex items-center gap-1 hover:text-orange-500 transition-colors">
            <FiMap className="h-3 w-3" /> System Design
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Auth;
