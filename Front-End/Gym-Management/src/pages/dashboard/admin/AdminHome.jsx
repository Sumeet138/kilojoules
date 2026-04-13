import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StatisticsCard } from "../../../widgets/cards";
import { fetchAllTrainers } from "../../../store/slices/trainerSlice";
import { fetchFitnessClasses } from "../../../store/slices/fitnessClassSlice";
import { fetchAllTransactions } from "../../../store/slices/transactionSlice";
import { getAllMembers } from "../../../API/ApiStore";
import { FiUsers, FiActivity, FiCalendar, FiDollarSign } from "react-icons/fi";

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
    { color: "warm",  icon: <FiUsers className="w-5 h-5" />,      title: "Total Members",   value: memberCount,         footer: "Registered members" },
    { color: "brown", icon: <FiActivity className="w-5 h-5" />,   title: "Trainers",         value: trainers.length,     footer: "Active trainers" },
    { color: "blue",  icon: <FiCalendar className="w-5 h-5" />,   title: "Fitness Classes",  value: classes.length,      footer: "Active classes" },
    { color: "green", icon: <FiDollarSign className="w-5 h-5" />, title: "Revenue",          value: `\u20B9${totalRevenue}`, footer: "Completed transactions" },
  ];

  return (
    <div className="mt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Welcome, {adminData.firstName || "Admin"}. Full system overview below.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map(({ color, icon, title, value, footer }) => (
          <StatisticsCard key={title} color={color} icon={icon} title={title} value={String(value)} footer={footer} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Recent Transactions</h3>
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0 text-sm">
              <div>
                <p className="font-medium text-gray-900">{t.member ? `${t.member.firstName} ${t.member.lastName}` : "Member"}</p>
                <p className="text-xs text-gray-400">{t.transactionType}</p>
              </div>
              <span className="font-semibold text-orange-600">{"\u20B9"}{t.amount}</span>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-gray-400 text-sm">No transactions yet.</p>}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Trainers</h3>
          {trainers.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                {t.firstName?.[0]}{t.lastName?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.firstName} {t.lastName}</p>
                <p className="text-xs text-gray-400">{t.specialization}</p>
              </div>
            </div>
          ))}
          {trainers.length === 0 && <p className="text-gray-400 text-sm">No trainers yet.</p>}
        </div>
      </div>
    </div>
  );
}
