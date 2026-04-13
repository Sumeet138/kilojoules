import { useNavigate } from "react-router-dom";
import { FiUser, FiActivity, FiShield, FiArrowRight } from "react-icons/fi";

const roles = [
  {
    role: "member",
    label: "Member",
    Icon: FiUser,
    desc: "Join as a fitness enthusiast",
    color: "bg-orange-50 text-orange-600",
  },
  {
    role: "trainer",
    label: "Trainer",
    Icon: FiActivity,
    desc: "Join as a fitness professional",
    color: "bg-amber-50 text-amber-600",
  },
  {
    role: "admin",
    label: "Admin",
    Icon: FiShield,
    desc: "Register as gym administrator",
    color: "bg-sky-50 text-sky-600",
  },
];

export function SignUpTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Create account</h2>
        <p className="text-sm text-gray-400 mt-1.5">Choose your account type to get started</p>
      </div>

      <div className="flex flex-col gap-3">
        {roles.map(({ role, label, Icon, desc, color }) => (
          <button
            key={role}
            onClick={() => navigate(`/auth/${role}/sign-up`)}
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left transition-all hover:border-orange-200 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400 truncate">{desc}</p>
            </div>
            <FiArrowRight className="h-4 w-4 text-gray-300 shrink-0 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/auth")}
          className="font-semibold text-orange-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default SignUpTypeSelection;
