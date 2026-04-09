import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchMemberTransactions } from "../../../store/slices/transactionSlice";

const STATUS_STYLES = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-blue-100 text-blue-700",
};

export default function MemberTransactions() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { transactions, loading } = useSelector((s) => s.transaction);

  useEffect(() => {
    if (memberId) dispatch(fetchMemberTransactions(memberId));
  }, [dispatch, memberId]);

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Transactions
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Your membership fees, PT sessions and other purchases
      </Typography>

      {/* Summary card */}
      <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm mb-6 inline-flex items-center gap-4">
        <span className="text-3xl">💰</span>
        <div>
          <Typography variant="small" className="text-gym-text-muted">Total Spent</Typography>
          <Typography variant="h4" className="font-bold text-gym-warm">₹{total}</Typography>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <span className="text-5xl block mb-3">🧾</span>
          No transactions yet.
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Date", "Type", "Description", "Method", "Amount", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={t.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 text-gym-text-muted">{t.transactionDate}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.transactionType}</td>
                  <td className="px-4 py-3 text-gym-text-primary">{t.description || "—"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.paymentMethod}</td>
                  <td className="px-4 py-3 font-semibold text-gym-warm">₹{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[t.status] || ""}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
