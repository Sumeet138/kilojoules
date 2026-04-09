import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

export function StatisticsCard({ color = "warm", icon, title, value, footer }) {
  const colorMap = {
    warm: "from-gym-warm to-gym-warm-dark",
    brown: "from-gym-brown to-gym-brown-dark",
    beige: "from-gym-beige-medium to-gym-beige-dark",
    green: "from-green-500 to-green-700",
    blue: "from-blue-500 to-blue-700",
    red: "from-red-400 to-red-600",
    purple: "from-purple-500 to-purple-700",
  };

  return (
    <Card className="border border-gym-beige-dark bg-gym-cream shadow-sm hover:shadow-md transition-shadow">
      <CardHeader
        variant="gradient"
        className={`absolute -mt-4 grid h-16 w-16 place-items-center bg-gradient-to-br ${colorMap[color]} shadow-lg shadow-gym-warm/30`}
      >
        <span className="text-2xl text-white">{icon}</span>
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-gym-text-muted">
          {title}
        </Typography>
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <div className="border-t border-gym-beige-dark p-4">
          <Typography className="font-normal text-gym-text-muted text-sm">
            {footer}
          </Typography>
        </div>
      )}
    </Card>
  );
}

StatisticsCard.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  footer: PropTypes.node,
};

export default StatisticsCard;
