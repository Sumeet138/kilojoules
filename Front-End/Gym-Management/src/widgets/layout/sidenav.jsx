import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;

  const sidenavTypes = {
    dark: "bg-gym-brown",
    white: "bg-gym-cream border-r border-gym-beige-dark",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border-0`}
    >
      <div className={`relative border-b ${sidenavType === "dark" ? "border-gym-warm/30" : "border-gym-beige-dark"}`}>
        <Link to="/" className="flex items-center gap-4 py-6 px-8">
          <img src={brandImg} alt="Kilojoules Logo" className="h-8 w-8" />
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "inherit"}
            className={`font-bold ${sidenavType === "dark" ? "text-gym-cream" : "text-gym-brown"}`}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-gym-charcoal" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  className={`font-semibold uppercase tracking-widest text-xs ${
                    sidenavType === "dark" ? "text-gym-beige-medium" : "text-gym-text-muted"
                  }`}
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon: NavIcon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive
                          ? "bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white shadow-md"
                          : sidenavType === "dark"
                          ? "text-gym-cream hover:bg-gym-warm/20"
                          : "text-gym-text-primary hover:bg-gym-beige-dark"
                      }`}
                      fullWidth
                    >
                      <NavIcon className="w-5 h-5 flex-shrink-0" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize text-sm"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

export default Sidenav;
