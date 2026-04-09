import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchAllTrainers } from "../../../store/slices/trainerSlice";
import { fetchFitnessClasses } from "../../../store/slices/fitnessClassSlice";
import { fetchAllTransactions } from "../../../store/slices/transactionSlice";
import { getAllMembers } from "../../../API/ApiStore";

export default function AdminHome() {
  const dispatch = useDispatch();
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const { trainers } = useSelector((s) => s.trainer);
  const { classes } = useSelector((s) => s.fitnessClass);
  const { transactions } = useSelector((s) => s.transaction);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    dispatch(fetchAllTrainers());
    dispatch(fetchFitnessClasses());
    dispatch(fetchAllTransactions());
    getAllMembers().then((r) => setMemberCount(r.data?.length || 0)).catch(() => {});
  }, [dispatch]);

  const totalRevenue = transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + (t.amount || 0), 0)
    .toFixed(2);

  const stats = [
    { color: "warm", icon: "👥", title: "Total Members", value: memberCount, footer: "Registered members" },
    { color: "brown", icon: "🏋️", title: "Trainers", value: trainers.length, footer: "Active trainers" },
    { color: "blue", icon: "📅", title: "Fitness Classes", value: classes.length, footer: "Active classes" },
    { color: "green", icon: "💰", title: "Revenue", value: `₹${totalRevenue}`, footer: "Completed transactions" },
  ];

  return (
    <div className="mt-4">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gym-text-primary">
          Admin Dashboard 👑
        </Typography>
        <Typography className="text-gym-text-muted mt-1">
          Welcome, {adminData.firstName || "Admin"}. Full system overview below.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ color, icon, title, value, footer }) => (
          <StatisticsCard
            key={title}
            color={color}
            icon={<span className="text-2xl">{icon}</span>}
            title={title}
            value={String(value)}
            footer={<span className="text-gym-text-muted text-xs">{footer}</span>}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            Recent Transactions
          </Typography>
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between items-center border-b border-gym-beige py-2 text-sm">
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary">
                  {t.memberName || "Member"}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted">{t.transactionType}</Typography>
              </div>
              <Typography variant="small" className="font-semibold text-gym-warm">₹{t.amount}</Typography>
            </div>
          ))}
          {transactions.length === 0 && (
            <Typography className="text-gym-text-muted text-sm">No transactions yet.</Typography>
          )}
        </div>

        {/* Trainers list */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">
            Trainers
          </Typography>
          {trainers.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 border-b border-gym-beige py-2">
              <div className="w-8 h-8 rounded-full bg-gym-brown flex items-center justify-center text-white text-sm font-bold">
                {t.firstName?.[0]}{t.lastName?.[0]}
              </div>
              <div>
                <Typography variant="small" className="font-medium text-gym-text-primary">
                  {t.firstName} {t.lastName}
                </Typography>
                <Typography variant="small" className="text-gym-text-muted">{t.specialization}</Typography>
              </div>
            </div>
          ))}
          {trainers.length === 0 && (
            <Typography className="text-gym-text-muted text-sm">No trainers yet.</Typography>
          )}
        </div>
      </div>
    </div>
  );
}
