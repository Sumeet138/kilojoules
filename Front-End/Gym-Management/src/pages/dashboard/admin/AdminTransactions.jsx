import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchAllTransactions } from "../../../store/slices/transactionSlice";

const STATUS_STYLES = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-blue-100 text-blue-700",
};

export default function AdminTransactions() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.transaction);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { dispatch(fetchAllTransactions()); }, [dispatch]);

  const totalRevenue = transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + (t.amount || 0), 0)
    .toFixed(2);

  const totalPending = transactions
    .filter((t) => t.status === "PENDING")
    .reduce((sum, t) => sum + (t.amount || 0), 0)
    .toFixed(2);

  const statuses = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"];
  const filtered = filter === "ALL" ? transactions : transactions.filter((t) => t.status === filter);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">Transactions</Typography>
      <Typography className="text-gym-text-muted mb-6">All financial transactions across the gym</Typography>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue}`, color: "bg-green-50 border-green-200", text: "text-green-700" },
          { label: "Pending", value: `₹${totalPending}`, color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" },
          { label: "All Transactions", value: transactions.length, color: "bg-gym-beige border-gym-beige-dark", text: "text-gym-warm" },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`rounded-xl border p-4 ${color}`}>
            <Typography variant="small" className="text-gym-text-muted">{label}</Typography>
            <Typography variant="h4" className={`font-bold ${text}`}>{value}</Typography>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === s ? "bg-gym-warm text-white" : "bg-gym-beige text-gym-text-secondary hover:bg-gym-beige-medium"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Date", "Member", "Type", "Description", "Method", "Amount", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 text-gym-text-muted">{t.transactionDate}</td>
                  <td className="px-4 py-3 text-gym-text-primary">{t.memberName || `#${t.memberId}`}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.transactionType}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.description || "—"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.paymentMethod}</td>
                  <td className="px-4 py-3 font-semibold text-gym-warm">₹{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[t.status] || ""}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gym-text-muted">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
