import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Auth, Dashboard } from "./layouts";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

// ---- Lazy auth pages ----
const LoginTypeSelection = lazy(() =>
  import("./pages/auth/LoginTypeSelection").then((m) => ({ default: m.LoginTypeSelection }))
);
const SignUpTypeSelection = lazy(() =>
  import("./pages/auth/SignUpTypeSelection").then((m) => ({ default: m.SignUpTypeSelection }))
);
const ForgotPasswordFlow = lazy(() =>
  import("./pages/auth/ForgotPasswordFlow").then((m) => ({ default: m.ForgotPasswordFlow }))
);
const MemberSignIn = lazy(() =>
  import("./pages/auth/member/MemberSignIn").then((m) => ({ default: m.MemberSignIn }))
);
const MemberSignUp = lazy(() =>
  import("./pages/auth/member/MemberSignUp").then((m) => ({ default: m.MemberSignUp }))
);
const TrainerSignIn = lazy(() =>
  import("./pages/auth/trainer/TrainerSignIn").then((m) => ({ default: m.TrainerSignIn }))
);
const TrainerSignUp = lazy(() =>
  import("./pages/auth/trainer/TrainerSignUp").then((m) => ({ default: m.TrainerSignUp }))
);
const AdminSignIn = lazy(() =>
  import("./pages/auth/admin/AdminSignIn").then((m) => ({ default: m.AdminSignIn }))
);
const AdminSignUp = lazy(() =>
  import("./pages/auth/admin/AdminSignUp").then((m) => ({ default: m.AdminSignUp }))
);
const SystemDesign = lazy(() => import("./pages/SystemDesign"));

// ---- Lazy member dashboard ----
const MemberHome = lazy(() => import("./pages/dashboard/member/MemberHome"));
const BookClasses = lazy(() => import("./pages/dashboard/member/BookClasses"));
const MyBookings = lazy(() => import("./pages/dashboard/member/MyBookings"));
const MemberDietPlans = lazy(() => import("./pages/dashboard/member/MemberDietPlans"));
const WorkoutHistory = lazy(() => import("./pages/dashboard/member/WorkoutHistory"));
const BMITracker = lazy(() => import("./pages/dashboard/member/BMITracker"));
const MemberTransactions = lazy(() => import("./pages/dashboard/member/MemberTransactions"));
const MemberNotifications = lazy(() => import("./pages/dashboard/member/MemberNotifications"));
const MemberProfile = lazy(() => import("./pages/dashboard/member/MemberProfile"));

// ---- Lazy trainer dashboard ----
const TrainerHome = lazy(() => import("./pages/dashboard/trainer/TrainerHome"));
const TrainerClasses = lazy(() => import("./pages/dashboard/trainer/TrainerClasses"));
const TrainerAttendance = lazy(() => import("./pages/dashboard/trainer/TrainerAttendance"));
const TrainerDietPlans = lazy(() => import("./pages/dashboard/trainer/TrainerDietPlans"));
const TrainerMembers = lazy(() => import("./pages/dashboard/trainer/TrainerMembers"));
const TrainerNotifications = lazy(() => import("./pages/dashboard/trainer/TrainerNotifications"));
const TrainerProfile = lazy(() => import("./pages/dashboard/trainer/TrainerProfile"));

// ---- Lazy admin dashboard ----
const AdminHome = lazy(() => import("./pages/dashboard/admin/AdminHome"));
const AdminMembers = lazy(() => import("./pages/dashboard/admin/AdminMembers"));
const AdminTrainers = lazy(() => import("./pages/dashboard/admin/AdminTrainers"));
const AdminClasses = lazy(() => import("./pages/dashboard/admin/AdminClasses"));
const AdminMemberships = lazy(() => import("./pages/dashboard/admin/AdminMemberships"));
const AdminTransactions = lazy(() => import("./pages/dashboard/admin/AdminTransactions"));
const AdminNotifications = lazy(() => import("./pages/dashboard/admin/AdminNotifications"));
const AdminProfile = lazy(() => import("./pages/dashboard/admin/AdminProfile"));

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
  </div>
);

const S = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

export const routes = [
  // ---- Auth routes ----
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { index: true, element: S(LoginTypeSelection) },
      { path: "sign-up", element: S(SignUpTypeSelection) },
      { path: "forgot-password", element: S(ForgotPasswordFlow) },
      { path: "member/sign-in", element: S(MemberSignIn) },
      { path: "member/sign-up", element: S(MemberSignUp) },
      { path: "trainer/sign-in", element: S(TrainerSignIn) },
      { path: "trainer/sign-up", element: S(TrainerSignUp) },
      { path: "admin/sign-in", element: S(AdminSignIn) },
      { path: "admin/sign-up", element: S(AdminSignUp) },
    ],
  },

  // ---- Member dashboard ----
  {
    path: "/dashboard/member",
    element: <ProtectedRoute allowedRole="member"><Dashboard /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: S(MemberHome) },
      { path: "book-classes", element: S(BookClasses) },
      { path: "bookings", element: S(MyBookings) },
      { path: "diet-plans", element: S(MemberDietPlans) },
      { path: "workouts", element: S(WorkoutHistory) },
      { path: "bmi", element: S(BMITracker) },
      { path: "transactions", element: S(MemberTransactions) },
      { path: "notifications", element: S(MemberNotifications) },
      { path: "profile", element: S(MemberProfile) },
    ],
  },

  // ---- Trainer dashboard ----
  {
    path: "/dashboard/trainer",
    element: <ProtectedRoute allowedRole="trainer"><Dashboard /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: S(TrainerHome) },
      { path: "classes", element: S(TrainerClasses) },
      { path: "attendance", element: S(TrainerAttendance) },
      { path: "diet-plans", element: S(TrainerDietPlans) },
      { path: "members", element: S(TrainerMembers) },
      { path: "notifications", element: S(TrainerNotifications) },
      { path: "profile", element: S(TrainerProfile) },
    ],
  },

  // ---- Admin dashboard ----
  {
    path: "/dashboard/admin",
    element: <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: S(AdminHome) },
      { path: "members", element: S(AdminMembers) },
      { path: "trainers", element: S(AdminTrainers) },
      { path: "classes", element: S(AdminClasses) },
      { path: "memberships", element: S(AdminMemberships) },
      { path: "transactions", element: S(AdminTransactions) },
      { path: "notifications", element: S(AdminNotifications) },
      { path: "profile", element: S(AdminProfile) },
    ],
  },

  // ---- System Design ----
  { path: "/system-design", element: S(SystemDesign) },

  // ---- Fallback ----
  { path: "*", element: <Navigate to="/auth" replace /> },
];
