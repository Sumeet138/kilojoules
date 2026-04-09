import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Alert } from "@material-tailwind/react";
import { fetchAllTrainers } from "../../../store/slices/trainerSlice";
import { deleteTrainer } from "../../../API/ApiStore";

export default function AdminTrainers() {
  const dispatch = useDispatch();
  const { trainers, loading } = useSelector((s) => s.trainer);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { dispatch(fetchAllTrainers()); }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trainer?")) return;
    try {
      await deleteTrainer(id);
      setSuccess("Trainer deleted.");
      dispatch(fetchAllTrainers());
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete trainer.");
    }
  };

  const filtered = trainers.filter((t) =>
    `${t.firstName} ${t.lastName} ${t.email} ${t.trainerId} ${t.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">Trainers Management</Typography>
      <Typography className="text-gym-text-muted mb-4">View and manage all trainers</Typography>

      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}
      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      <input
        type="text"
        placeholder="Search trainers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none mb-5"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <div className="bg-gym-cream border border-gym-beige-dark rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gym-beige">
              <tr>
                {["ID", "Name", "Email", "Specialization", "Certification", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 text-gym-text-muted">{t.trainerId}</td>
                  <td className="px-4 py-3 font-medium text-gym-text-primary">{t.firstName} {t.lastName}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.email}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.specialization || "—"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{t.certificationLevel || "—"}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="text" onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-0">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gym-text-muted">No trainers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
