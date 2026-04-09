import { Outlet, useLocation } from "react-router-dom";
import { Sidenav, DashboardNavbar, Footer } from "../widgets/layout";
import { useMaterialTailwindController, setOpenSidenav } from "../context";

// Role-specific nav items
const memberRoutes = [
  {
    layout: "dashboard/member",
    title: "Member",
    pages: [
      { icon: "🏠", name: "Home", path: "/home" },
      { icon: "📅", name: "Book Classes", path: "/book-classes" },
      { icon: "📋", name: "My Bookings", path: "/bookings" },
      { icon: "🥗", name: "Diet Plans", path: "/diet-plans" },
      { icon: "💪", name: "Workout History", path: "/workouts" },
      { icon: "⚖️", name: "BMI Tracker", path: "/bmi" },
      { icon: "💰", name: "Transactions", path: "/transactions" },
      { icon: "🔔", name: "Notifications", path: "/notifications" },
      { icon: "👤", name: "Profile", path: "/profile" },
    ],
  },
];

const trainerRoutes = [
  {
    layout: "dashboard/trainer",
    title: "Trainer",
    pages: [
      { icon: "🏠", name: "Home", path: "/home" },
      { icon: "🏋️", name: "My Classes", path: "/classes" },
      { icon: "✅", name: "Attendance", path: "/attendance" },
      { icon: "🥗", name: "Diet Plans", path: "/diet-plans" },
      { icon: "👥", name: "My Members", path: "/members" },
      { icon: "🔔", name: "Notifications", path: "/notifications" },
      { icon: "👤", name: "Profile", path: "/profile" },
    ],
  },
];

const adminRoutes = [
  {
    layout: "dashboard/admin",
    title: "Admin",
    pages: [
      { icon: "🏠", name: "Home", path: "/home" },
      { icon: "👥", name: "Members", path: "/members" },
      { icon: "🏋️", name: "Trainers", path: "/trainers" },
      { icon: "📅", name: "Fitness Classes", path: "/classes" },
      { icon: "🎫", name: "Memberships", path: "/memberships" },
      { icon: "💰", name: "Transactions", path: "/transactions" },
      { icon: "🔔", name: "Notifications", path: "/notifications" },
      { icon: "👤", name: "Profile", path: "/profile" },
    ],
  },
];

function getRoutes(role) {
  if (role === "trainer") return trainerRoutes;
  if (role === "admin") return adminRoutes;
  return memberRoutes;
}

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { pathname } = useLocation();

  const userRole = localStorage.getItem("userRole") || "member";
  const routes = getRoutes(userRole);

  return (
    <div className="min-h-screen bg-gym-beige">
      <Sidenav
        routes={routes}
        brandImg="/gym-icon.svg"
        brandName="GymPro"
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <main>
          <Outlet />
        </main>
        <div className="text-gym-text-muted">
          <Footer
            brandName="GymPro"
            routes={[
              { name: "About", path: "#" },
              { name: "Support", path: "#" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
