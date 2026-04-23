import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Alert } from "@material-tailwind/react";
import { fetchAllTransactions, recordTransactionThunk, updateTransactionStatusThunk, deleteTransactionThunk } from "../../../store/slices/transactionSlice";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";

const STATUS_STYLES = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING:   "bg-yellow-100 text-yellow-700",
  FAILED:    "bg-red-100 text-red-600",
  REFUNDED:  "bg-blue-100 text-blue-700",
};

const STATUSES     = ["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"];
const TX_TYPES     = ["MEMBERSHIP_FEE", "PERSONAL_TRAINER", "SUPPLEMENT", "OTHER"];
const PAY_METHODS  = ["CASH", "CARD", "UPI", "NET_BANKING"];
const BLANK_FORM   = { memberId: "", transactionType: "MEMBERSHIP_FEE", amount: "", description: "", paymentMethod: "CASH" };

export default function AdminTransactions() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.transaction);
  const [filter, setFilter]     = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { dispatch(fetchAllTransactions()); }, [dispatch]);

  const totalRevenue = transactions.filter((t) => t.status === "COMPLETED").reduce((s, t) => s + (t.amount || 0), 0).toFixed(2);
  const totalPending = transactions.filter((t) => t.status === "PENDING").reduce((s, t) => s + (t.amount || 0), 0).toFixed(2);
  const filtered     = filter === "ALL" ? transactions : transactions.filter((t) => t.status === filter);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(recordTransactionThunk({ ...form, memberId: Number(form.memberId), amount: parseFloat(form.amount) }));
    setSubmitting(false);
    if (recordTransactionThunk.fulfilled.match(result)) {
      setShowModal(false);
      setForm(BLANK_FORM);
      setMsg({ type: "green", text: "Transaction recorded successfully." });
    } else {
      setMsg({ type: "red", text: String(result.payload || "Failed to record.") });
    }
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    await dispatch(updateTransactionStatusThunk({ id, status }));
    setUpdatingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction? This cannot be undone.")) return;
    setDeletingId(id);
    await dispatch(deleteTransactionThunk(id));
    setDeletingId(null);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Transactions</Typography>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gym-warm text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <FiPlus className="w-4 h-4" /> Record Transaction
        </button>
      </div>
      <Typography className="text-gym-text-muted mb-5">All financial transactions across the gym</Typography>

      {msg.text && <Alert color={msg.type} className="mb-4">{msg.text}</Alert>}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Revenue",     value: `₹${totalRevenue}`, color: "bg-green-50 border-green-200",   text: "text-green-700" },
          { label: "Pending",           value: `₹${totalPending}`, color: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" },
          { label: "All Transactions",  value: transactions.length, color: "bg-gym-beige border-gym-beige-dark", text: "text-gym-warm" },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`rounded-xl border p-4 ${color}`}>
            <Typography variant="small" className="text-gym-text-muted">{label}</Typography>
            <Typography variant="h4" className={`font-bold ${text}`}>{value}</Typography>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === s ? "bg-gym-warm text-white" : "bg-gym-beige text-gym-text-secondary hover:bg-gym-beige-medium"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" /></div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Date", "Member", "Type", "Description", "Method", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 text-gym-text-muted whitespace-nowrap">{t.transactionDate}</td>
                  <td className="px-4 py-3 text-gym-text-primary whitespace-nowrap">{t.member ? `${t.member.firstName} ${t.member.lastName}` : "\u2014"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">{t.transactionType}</td>
                  <td className="px-4 py-3 text-gym-text-secondary max-w-[160px] truncate">{t.description || "\u2014"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary whitespace-nowrap">{t.paymentMethod}</td>
                  <td className="px-4 py-3 font-semibold text-gym-warm whitespace-nowrap">{'\u20b9'}{t.amount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-1 focus:ring-gym-warm ${STATUS_STYLES[t.status] || ""} disabled:opacity-50`}
                    >
                      {["COMPLETED","PENDING","FAILED","REFUNDED"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                      title="Delete transaction"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gym-text-muted">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Record Transaction</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"><FiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRecord} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Member ID <span className="text-red-400">*</span></label>
                <input name="memberId" type="number" required value={form.memberId} onChange={handleFormChange}
                  placeholder="e.g. 1"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gym-warm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Transaction Type</label>
                <select name="transactionType" value={form.transactionType} onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gym-warm focus:outline-none">
                  {TX_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Amount (₹) <span className="text-red-400">*</span></label>
                <input name="amount" type="number" step="0.01" min="1" required value={form.amount} onChange={handleFormChange}
                  placeholder="e.g. 2500"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gym-warm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gym-warm focus:outline-none">
                  {PAY_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <input name="description" value={form.description} onChange={handleFormChange}
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gym-warm focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-gym-warm text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {submitting ? "Recording…" : "Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
