import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

export function StatisticsChart({ chart, title, description, footer }) {
  return (
    <Card className="border border-gym-beige-dark bg-gym-cream shadow-sm">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-1 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gradient-to-br from-gym-warm to-gym-warm-dark p-2 text-white">
          <span className="text-xl">{chart.icon || "—"}</span>
        </div>
        <div>
          <Typography variant="h6" className="font-bold text-gym-text-primary">
            {title}
          </Typography>
          <Typography variant="small" className="font-normal text-gym-text-muted">
            {description}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chart} />
      </CardBody>
      {footer && (
        <div className="border-t border-gym-beige-dark px-4 py-3">
          <Typography className="font-normal text-gym-text-muted text-sm">
            {footer}
          </Typography>
        </div>
      )}
    </Card>
  );
}

StatisticsChart.propTypes = {
  chart: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  footer: PropTypes.node,
};

export default StatisticsChart;
