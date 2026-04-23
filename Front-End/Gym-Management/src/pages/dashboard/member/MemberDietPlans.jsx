import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Alert } from "@material-tailwind/react";
import { fetchDietPlans } from "../../../store/slices/dietPlanSlice";
import { createNotification } from "../../../API/ApiStore";
import { FiFeather, FiSend } from "react-icons/fi";

export default function MemberDietPlans() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const memberName = localStorage.getItem("memberName") || `Member #${memberId}`;
  const { plans, loading } = useSelector((s) => s.dietPlan);
  const [showRequest, setShowRequest] = useState(false);
  const [goals, setGoals] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (memberId) dispatch(fetchDietPlans(memberId));
  }, [dispatch, memberId]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createNotification({
        title: "Diet Plan Request",
        message: `${memberName} has requested a diet plan. Goals: ${goals || "Not specified"}`,
        role: "TRAINER",
      });
      setMsg({ type: "green", text: "Request sent! Your trainer will assign a plan soon." });
      setShowRequest(false);
      setGoals("");
    } catch {
      setMsg({ type: "red", text: "Failed to send request. Please try again." });
    } finally {
      setSending(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h4" className="font-bold text-gym-text-primary">Diet Plans</Typography>
        <Button
          size="sm"
          onClick={() => setShowRequest(!showRequest)}
          className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white flex items-center gap-1.5"
        >
          <FiSend className="w-3.5 h-3.5" />
          {showRequest ? "Cancel" : "Request a Plan"}
        </Button>
      </div>
      <Typography className="text-gym-text-muted mb-5">
        Nutrition plans assigned by your trainer
      </Typography>

      {msg.text && <Alert color={msg.type} className="mb-4 text-sm">{msg.text}</Alert>}

      {showRequest && (
        <form onSubmit={handleRequest} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 mb-6 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">Request a Diet Plan</Typography>
          <p className="text-sm text-gym-text-muted mb-3">
            Describe your fitness goals or dietary preferences and your trainer will create a personalised plan.
          </p>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. I want to lose weight, I'm vegetarian, targeting 2000 kcal..."
            rows={3}
            className="w-full rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-sm text-gym-text-primary focus:border-gym-warm focus:outline-none resize-none mb-3"
          />
          <Button type="submit" loading={sending} size="sm" className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white">
            {sending ? "Sending…" : "Send Request"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-gym-text-muted">
          <FiFeather className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>No diet plans assigned yet.</p>
          <p className="text-sm mt-1">Use the <strong>Request a Plan</strong> button above to ask your trainer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
              <Typography variant="h6" className="font-bold text-gym-text-primary mb-1">
                {plan.planName}
              </Typography>
              <Typography variant="small" className="text-gym-text-muted mb-4">
                {plan.description}
              </Typography>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { label: "Calories", value: plan.totalCalories, unit: "kcal", color: "bg-orange-50 text-orange-700" },
                  { label: "Protein",  value: plan.proteinGrams,  unit: "g",    color: "bg-blue-50 text-blue-700"   },
                  { label: "Carbs",    value: plan.carbsGrams,    unit: "g",    color: "bg-yellow-50 text-yellow-700"},
                  { label: "Fats",     value: plan.fatsGrams,     unit: "g",    color: "bg-red-50 text-red-700"     },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className={`rounded-lg p-3 ${color}`}>
                    <Typography variant="small" className="font-medium">{label}</Typography>
                    <Typography variant="h6" className="font-bold">
                      {value ?? "—"} <span className="text-xs font-normal">{unit}</span>
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gym-text-muted">
                {plan.trainer && (
                  <span>By: {plan.trainer.firstName} {plan.trainer.lastName}</span>
                )}
                {plan.createdAt && (
                  <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
