import { Typography } from "@material-tailwind/react";

export function Footer({ brandName = "GymPro", brandLink = "/", routes = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-gym-text-muted">
          &copy; {year}{" "}
          <a
            href={brandLink}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-gym-warm"
          >
            {brandName}
          </a>{" "}
          — Fitness Center Management
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-gym-text-muted transition-colors hover:text-gym-warm"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.displayName = "/src/widgets/layout/footer.jsx";
export default Footer;
