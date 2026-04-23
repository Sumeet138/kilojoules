import { Outlet, useLocation } from "react-router-dom";
import { Sidenav, DashboardNavbar, Footer } from "../widgets/layout";
import { useMaterialTailwindController, setOpenSidenav } from "../context";
import {
  FiHome, FiCalendar, FiList, FiFeather, FiActivity,
  FiTrendingUp, FiCreditCard, FiBell, FiUser, FiUsers,
  FiCheckSquare, FiTag, FiBriefcase, FiGrid, FiLock, FiClipboard,
} from "react-icons/fi";

// Role-specific nav items
const memberRoutes = [
  {
    layout: "dashboard/member",
    title: "Member",
    pages: [
      { icon: FiHome,       name: "Home",            path: "/home" },
      { icon: FiCalendar,   name: "Book Classes",    path: "/book-classes" },
      { icon: FiList,       name: "My Bookings",     path: "/bookings" },
      { icon: FiFeather,    name: "Diet Plans",      path: "/diet-plans" },
      { icon: FiActivity,   name: "Workout History", path: "/workouts" },
      { icon: FiTrendingUp, name: "BMI Tracker",     path: "/bmi" },
      { icon: FiCreditCard, name: "Transactions",    path: "/transactions" },
      { icon: FiBell,       name: "Notifications",   path: "/notifications" },
      { icon: FiUser,       name: "Profile",         path: "/profile" },
    ],
  },
];

const trainerRoutes = [
  {
    layout: "dashboard/trainer",
    title: "Trainer",
    pages: [
      { icon: FiHome,        name: "Home",          path: "/home" },
      { icon: FiActivity,    name: "My Classes",    path: "/classes" },
      { icon: FiCheckSquare, name: "Attendance",    path: "/attendance" },
      { icon: FiFeather,     name: "Diet Plans",    path: "/diet-plans" },
      { icon: FiUsers,       name: "My Members",    path: "/members" },
      { icon: FiCreditCard,  name: "Payments",      path: "/transactions" },
      { icon: FiBell,        name: "Notifications", path: "/notifications" },
      { icon: FiUser,        name: "Profile",       path: "/profile" },
    ],
  },
];

const adminRoutes = [
  {
    layout: "dashboard/admin",
    title: "Admin",
    pages: [
      { icon: FiGrid,       name: "Home",            path: "/home" },
      { icon: FiUsers,      name: "Members",         path: "/members" },
      { icon: FiBriefcase,  name: "Trainers",        path: "/trainers" },
      { icon: FiCalendar,   name: "Fitness Classes", path: "/classes" },
      { icon: FiTag,        name: "Memberships",     path: "/memberships" },
      { icon: FiCreditCard, name: "Transactions",       path: "/transactions" },
      { icon: FiClipboard,  name: "Booking Approvals",   path: "/bookings" },
      { icon: FiBell,       name: "Notifications",       path: "/notifications" },
      { icon: FiUser,       name: "Profile",             path: "/profile" },
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
    <div className="min-h-screen bg-gray-50/80">
      <Sidenav
        routes={routes}
        brandImg="/gym-icon.svg"
        brandName="Kilojoules"
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <main>
          <Outlet />
        </main>
        <div className="text-gym-text-muted">
          <Footer
            brandName="Kilojoules"
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
