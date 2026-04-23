import { useEffect, useState, useMemo } from "react";
import { Typography, Alert } from "@material-tailwind/react";
import {
  getAllActivePlans,
  getMemberMemberships,
  getActiveMembership,
  subscribeToPlan,
  cancelMembership,
} from "../../../API/ApiStore";
import { FiStar, FiCheckCircle, FiClock, FiXCircle, FiAward } from "react-icons/fi";

const PLAN_COLORS = {
  MONTHLY:   "from-blue-400 to-blue-600",
  QUARTERLY: "from-purple-400 to-purple-600",
  ANNUAL:    "from-gym-warm to-orange-600",
  WEEKLY:    "from-green-400 to-green-600",
};

const STATUS_STYLES = {
  ACTIVE:    "bg-green-100 text-green-700",
  EXPIRED:   "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function MemberMemberships() {
  const memberId = localStorage.getItem("memberId");

  const [plans,           setPlans]           = useState([]);
  const [myMemberships,   setMyMemberships]   = useState([]);
  const [activePlan,      setActivePlan]      = useState(null);
  const [loadingPlans,    setLoadingPlans]    = useState(true);
  const [subscribingId,   setSubscribingId]   = useState(null);
  const [cancellingId,    setCancellingId]    = useState(null);
  const [confirmPlan,     setConfirmPlan]     = useState(null);
  const [msg,             setMsg]             = useState({ type: "", text: "" });

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4500);
  };

  const loadAll = async () => {
    setLoadingPlans(true);
    try {
      const [plansRes, myRes, activeRes] = await Promise.all([
        getAllActivePlans(),
        getMemberMemberships(memberId),
        getActiveMembership(memberId).catch(() => ({ data: null })),
      ]);
      setPlans(plansRes.data || []);
      setMyMemberships(myRes.data || []);
      setActivePlan(activeRes.data || null);
    } catch {
      flash("red", "Failed to load membership data.");
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => { if (memberId) loadAll(); }, [memberId]);

  /* Deduplicate plans by name — keeps cheapest/first occurrence */
  const uniquePlans = useMemo(() => {
    const seen = new Map();
    for (const p of plans) {
      if (!seen.has(p.planName)) seen.set(p.planName, p);
    }
    return Array.from(seen.values());
  }, [plans]);

  const handleSubscribe = async () => {
    if (!confirmPlan) return;
    setSubscribingId(confirmPlan.id);
    setConfirmPlan(null);
    try {
      await subscribeToPlan(memberId, confirmPlan.id);
      flash("green", `Successfully subscribed to ${confirmPlan.planName}!`);
      loadAll();
    } catch (e) {
      flash("red", e.response?.data || "Failed to subscribe.");
    } finally {
      setSubscribingId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this membership?")) return;
    setCancellingId(id);
    try {
      await cancelMembership(id);
      flash("amber", "Membership cancelled.");
      loadAll();
    } catch {
      flash("red", "Failed to cancel membership.");
    } finally {
      setCancellingId(null);
    }
  };

  const daysLeft = (endDate) => {
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-1">Membership</Typography>
      <Typography className="text-gym-text-muted mb-5">
        View your current plan and subscribe to a new membership
      </Typography>

      {msg.text && <Alert color={msg.type} className="mb-4 text-sm">{msg.text}</Alert>}

      {/* Confirm subscribe modal */}
      {confirmPlan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <FiAward className="w-8 h-8 text-gym-warm mx-auto mb-3" />
            <Typography variant="h6" className="font-bold text-center text-gym-text-primary mb-1">
              Subscribe to {confirmPlan.planName}
            </Typography>
            <p className="text-sm text-center text-gym-text-muted mb-4">
              ₹{confirmPlan.price} · {confirmPlan.durationDays} days
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSubscribe}
                className="flex-1 py-2 bg-gym-warm text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmPlan(null)}
                className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingPlans ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Active membership banner */}
          {activePlan ? (
            <div className="bg-gradient-to-r from-gym-warm to-orange-500 rounded-2xl p-5 mb-6 text-white shadow-md">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiStar className="w-5 h-5" />
                    <span className="font-bold text-lg">{activePlan.plan?.planName}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{activePlan.plan?.planType}</span>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{activePlan.plan?.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      Active until {activePlan.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {daysLeft(activePlan.endDate)} days left
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{activePlan.plan?.price}</div>
                  <button
                    onClick={() => handleCancel(activePlan.id)}
                    disabled={cancellingId === activePlan.id}
                    className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {cancellingId === activePlan.id ? "Cancelling…" : "Cancel Plan"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-700 text-sm flex items-center gap-2">
              <FiXCircle className="w-4 h-4 shrink-0" />
              You don't have an active membership. Subscribe to a plan below to access all gym facilities.
            </div>
          )}

          {/* Available plans */}
          <Typography variant="h5" className="font-bold text-gym-text-primary mb-3">Available Plans</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {uniquePlans.map((plan) => {
              const isCurrentPlan = activePlan?.plan?.id === plan.id;
              const gradient = PLAN_COLORS[plan.planType] || PLAN_COLORS.MONTHLY;
              return (
                <div
                  key={plan.id}
                  className={`bg-gym-cream border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md ${
                    isCurrentPlan ? "border-gym-warm ring-2 ring-gym-warm/30" : "border-gym-beige-dark"
                  }`}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${gradient} px-5 py-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{plan.planType}</span>
                      {isCurrentPlan && (
                        <span className="text-xs font-semibold bg-white text-gym-warm px-2 py-0.5 rounded-full">Current Plan</span>
                      )}
                    </div>
                    <div className="mt-2 font-bold text-xl">{plan.planName}</div>
                    <div className="text-3xl font-bold mt-1">₹{plan.price}</div>
                    <div className="text-sm opacity-80">{plan.durationDays} days</div>
                  </div>
                  {/* Body */}
                  <div className="px-5 py-4">
                    <p className="text-sm text-gym-text-muted mb-4 min-h-[40px]">
                      {plan.description || "Full gym access included."}
                    </p>
                    <button
                      onClick={() => setConfirmPlan(plan)}
                      disabled={isCurrentPlan || subscribingId === plan.id}
                      className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                        isCurrentPlan
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-gym-warm text-white hover:bg-orange-600"
                      }`}
                    >
                      {subscribingId === plan.id ? "Subscribing…" : isCurrentPlan ? "✓ Subscribed" : "Subscribe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Membership history */}
          {myMemberships.length > 0 && (
            <>
              <Typography variant="h5" className="font-bold text-gym-text-primary mb-3">Membership History</Typography>
              <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gym-beige">
                    <tr>
                      {["Plan", "Type", "Start", "End", "Status", "Payment"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myMemberships.map((m, idx) => (
                      <tr key={m.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                        <td className="px-4 py-3 font-medium text-gym-text-primary">{m.plan?.planName}</td>
                        <td className="px-4 py-3 text-gym-text-secondary">{m.plan?.planType}</td>
                        <td className="px-4 py-3 text-gym-text-muted whitespace-nowrap">{m.startDate}</td>
                        <td className="px-4 py-3 text-gym-text-muted whitespace-nowrap">{m.endDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[m.status] || ""}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            m.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {m.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
