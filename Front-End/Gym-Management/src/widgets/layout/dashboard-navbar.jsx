import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const userRole = localStorage.getItem("userRole") || "member";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-gym-warm/10 border border-gym-beige-dark bg-gym-cream"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="inherit"
                className="font-normal opacity-50 transition-all hover:text-gym-warm hover:opacity-100 text-gym-text-secondary"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="inherit"
              className="font-normal text-gym-text-primary"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="inherit" className="font-bold text-gym-text-primary">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56"></div>
          <IconButton
            variant="text"
            color="inherit"
            className="grid xl:hidden text-gym-brown"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-gym-brown" />
          </IconButton>
          <Link to={`/${layout}/profile`}>
            <Button
              variant="text"
              className="hidden items-center gap-1 px-4 xl:flex normal-case text-gym-text-primary hover:text-gym-warm"
            >
              <UserCircleIcon className="h-5 w-5 text-gym-warm" />
              Profile
            </Button>
          </Link>
          <IconButton variant="text" className="text-gym-text-primary hover:text-gym-warm">
            <BellIcon className="h-5 w-5 text-gym-warm" />
          </IconButton>
          <Button
            variant="text"
            size="sm"
            className="hidden xl:flex items-center gap-1 normal-case text-gym-text-secondary hover:text-red-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
