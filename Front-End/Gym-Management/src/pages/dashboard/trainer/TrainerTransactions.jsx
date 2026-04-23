import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchTrainerTransactions } from "../../../store/slices/transactionSlice";
import { FiDollarSign, FiRefreshCw } from "react-icons/fi";

const STATUS_STYLES = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING:   "bg-yellow-100 text-yellow-700",
  FAILED:    "bg-red-100 text-red-600",
  REFUNDED:  "bg-blue-100 text-blue-700",
};

export default function TrainerTransactions() {
  const dispatch  = useDispatch();
  const trainerId = localStorage.getItem("trainerId");
  const { transactions, loading } = useSelector((s) => s.transaction);

  useEffect(() => {
    if (trainerId) dispatch(fetchTrainerTransactions(trainerId));
  }, [dispatch, trainerId]);

  const totalCompleted = transactions.filter((t) => t.status === "COMPLETED").reduce((s, t) => s + (t.amount || 0), 0).toFixed(2);
  const totalPending   = transactions.filter((t) => t.status === "PENDING").reduce((s, t) => s + (t.amount || 0), 0).toFixed(2);

  const refresh = () => trainerId && dispatch(fetchTrainerTransactions(trainerId));

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">
        Member Payments
      </Typography>
      <Typography className="text-gym-text-muted mb-5">
        Payment status of members booked into your classes
      </Typography>

      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <FiDollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-green-600">Collected</p>
            <p className="font-bold text-green-700 text-lg">₹{totalCompleted}</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <FiDollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-yellow-600">Pending</p>
            <p className="font-bold text-yellow-700 text-lg">₹{totalPending}</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <FiDollarSign className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          No payment records yet. Members who book your classes will appear here.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Member", "Description", "Amount", "Payment Method", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={t.id} className={`border-t border-gray-100 ${idx % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{t.transactionDate}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {t.memberName || (t.memberId ? `Member #${t.memberId}` : "—")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{t.description || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gym-warm whitespace-nowrap">₹{t.amount}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{t.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[t.status] || "bg-gray-100 text-gray-600"}`}>
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
