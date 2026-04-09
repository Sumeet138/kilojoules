import { useEffect, useState } from "react";
import { Typography, Button, Alert } from "@material-tailwind/react";
import { getAllMembers, deleteMember } from "../../../API/ApiStore";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    getAllMembers()
      .then((r) => setMembers(r.data || []))
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member? This cannot be undone.")) return;
    try {
      await deleteMember(id);
      setSuccess("Member deleted.");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete member.");
    }
  };

  const filtered = members.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.email} ${m.memberId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">Members Management</Typography>
      <Typography className="text-gym-text-muted mb-4">View and manage all registered members</Typography>

      {error && <Alert color="red" className="mb-4 text-sm">{error}</Alert>}
      {success && <Alert color="green" className="mb-4 text-sm">{success}</Alert>}

      <input
        type="text"
        placeholder="Search members..."
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
                {["ID", "Name", "Email", "Phone", "Gender", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gym-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => (
                <tr key={m.id} className={`border-t border-gym-beige-dark ${idx % 2 === 0 ? "" : "bg-gym-beige/30"}`}>
                  <td className="px-4 py-3 text-gym-text-muted">{m.memberId}</td>
                  <td className="px-4 py-3 font-medium text-gym-text-primary">{m.firstName} {m.lastName}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{m.email}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{m.phone || "—"}</td>
                  <td className="px-4 py-3 text-gym-text-secondary">{m.gender || "—"}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="text"
                      onClick={() => handleDelete(m.id)}
                      className="text-red-500 hover:text-red-700 p-0"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gym-text-muted">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
