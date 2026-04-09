import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Input, Alert } from "@material-tailwind/react";
import { fetchBMIHistory, recordBMIThunk } from "../../../store/slices/bmiSlice";

const BMI_COLORS = {
  UNDERWEIGHT: { bg: "bg-blue-100", text: "text-blue-700", bar: "#3B82F6" },
  NORMAL: { bg: "bg-green-100", text: "text-green-700", bar: "#22C55E" },
  OVERWEIGHT: { bg: "bg-yellow-100", text: "text-yellow-700", bar: "#EAB308" },
  OBESE: { bg: "bg-red-100", text: "text-red-700", bar: "#EF4444" },
};

export default function BMITracker() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem("memberId");
  const memberData = JSON.parse(localStorage.getItem("memberData") || "{}");
  const { records, loading } = useSelector((s) => s.bmi);

  const [form, setForm] = useState({
    heightCm: memberData.heightCm || "",
    weightKg: memberData.weightKg || "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (memberId) dispatch(fetchBMIHistory(memberId));
  }, [dispatch, memberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    const result = await dispatch(recordBMIThunk({
      memberId: Number(memberId),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      notes: form.notes,
    }));
    if (recordBMIThunk.fulfilled.match(result)) {
      setSuccess("BMI recorded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Failed to record BMI.");
    }
    setSubmitting(false);
  };

  const latest = records[0];
  const bmiStyle = latest ? BMI_COLORS[latest.bmiCategory] || BMI_COLORS.NORMAL : null;

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        BMI Tracker
      </Typography>
      <Typography className="text-gym-text-muted mb-6">
        Monitor your body mass index over time
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Record form */}
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl p-5 shadow-sm">
          <Typography variant="h6" className="font-bold text-gym-text-primary mb-4">Record BMI</Typography>
          {error && <Alert color="red" className="mb-3 text-sm">{error}</Alert>}
          {success && <Alert color="green" className="mb-3 text-sm">{success}</Alert>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {[
              { label: "Height (cm)", name: "heightCm", placeholder: "175" },
              { label: "Weight (kg)", name: "weightKg", placeholder: "70" },
              { label: "Notes (optional)", name: "notes", placeholder: "Any relevant notes..." },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <Typography variant="small" className="font-medium text-gym-text-primary mb-1">{label}</Typography>
                <Input
                  type={name === "notes" ? "text" : "number"}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  required={name !== "notes"}
                  className="!border-gym-beige-dark focus:!border-gym-warm bg-white"
                  labelProps={{ className: "hidden" }}
                />
              </div>
            ))}
            <Button
              type="submit"
              loading={submitting}
              fullWidth
              className="bg-gradient-to-r from-gym-warm to-gym-warm-dark text-white mt-2"
            >
              {submitting ? "Recording..." : "Record BMI"}
            </Button>
          </form>
        </div>

        {/* Latest BMI card */}
        {latest && bmiStyle && (
          <div className={`rounded-xl p-5 shadow-sm border ${bmiStyle.bg} border-transparent`}>
            <Typography variant="h6" className={`font-bold mb-4 ${bmiStyle.text}`}>
              Latest Reading
            </Typography>
            <div className="flex items-end gap-3 mb-4">
              <Typography variant="h1" className={`font-bold ${bmiStyle.text}`} style={{ fontSize: "4rem" }}>
                {latest.bmi}
              </Typography>
              <Typography className={`mb-2 font-semibold ${bmiStyle.text}`}>
                {latest.bmiCategory}
              </Typography>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <span className={bmiStyle.text}>Height: {latest.heightCm} cm</span>
              <span className={bmiStyle.text}>Weight: {latest.weightKg} kg</span>
              <span className={bmiStyle.text}>Date: {latest.recordDate}</span>
            </div>
          </div>
        )}
      </div>

      {/* History table */}
      <Typography variant="h6" className="font-bold text-gym-text-primary mb-3">
        BMI History
      </Typography>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : records.length === 0 ? (
        <Typography className="text-gym-text-muted">No records yet.</Typography>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["Date", "Height (cm)", "Weight (kg)", "BMI", "Category", "Notes"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => {
                const s = BMI_COLORS[r.bmiCategory];
                return (
                  <tr key={r.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                    <td className="px-4 py-3 text-gym-text-secondary">{r.recordDate}</td>
                    <td className="px-4 py-3">{r.heightCm}</td>
                    <td className="px-4 py-3">{r.weightKg}</td>
                    <td className="px-4 py-3 font-semibold">{r.bmi}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s?.bg} ${s?.text}`}>
                        {r.bmiCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gym-text-muted">{r.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
