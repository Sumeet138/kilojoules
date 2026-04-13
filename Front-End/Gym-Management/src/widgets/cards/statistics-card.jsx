import { Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

export function StatisticsCard({ color = "warm", icon, title, value, footer }) {
  const bgMap = {
    warm: "bg-orange-50 text-orange-600",
    brown: "bg-amber-50 text-amber-600",
    beige: "bg-stone-100 text-stone-500",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgMap[color]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
        </div>
      </div>
      {footer && (
        <p className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">{footer}</p>
      )}
    </div>
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
