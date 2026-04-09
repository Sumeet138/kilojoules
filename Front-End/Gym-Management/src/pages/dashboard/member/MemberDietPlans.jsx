import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchDietPlans } from "../../../store/slices/dietPlanSlice";

export default function MemberDietPlans() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const { plans, loading } = useSelector((s) => s.dietPlan);

  useEffect(() => {
    if (memberId) dispatch(fetchDietPlans(memberId));
  }, [dispatch, memberId]);

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        Diet Plans
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Nutrition plans assigned by your trainer
      </Typography>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-gym-text-muted">
          <span className="text-5xl block mb-3">🥗</span>
          No diet plans assigned yet.
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

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Calories", value: plan.totalCalories, unit: "kcal", color: "bg-orange-50 text-orange-700" },
                  { label: "Protein", value: plan.proteinGrams, unit: "g", color: "bg-blue-50 text-blue-700" },
                  { label: "Carbs", value: plan.carbsGrams, unit: "g", color: "bg-yellow-50 text-yellow-700" },
                  { label: "Fats", value: plan.fatsGrams, unit: "g", color: "bg-red-50 text-red-700" },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className={`rounded-lg p-3 ${color}`}>
                    <Typography variant="small" className="font-medium">{label}</Typography>
                    <Typography variant="h6" className="font-bold">
                      {value ?? "—"} <span className="text-xs font-normal">{unit}</span>
                    </Typography>
                  </div>
                ))}
              </div>

              {plan.trainer && (
                <Typography variant="small" className="text-gym-text-muted mt-3">
                  Assigned by: {plan.trainer.firstName} {plan.trainer.lastName}
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
