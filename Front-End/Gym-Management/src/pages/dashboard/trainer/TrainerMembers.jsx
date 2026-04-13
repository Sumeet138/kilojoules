import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import { fetchAllTrainers } from "../../../store/slices/trainerSlice";
import { getAllMembers } from "../../../API/ApiStore";
import { FiMail, FiPhone, FiTarget } from "react-icons/fi";

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllMembers()
      .then((r) => setMembers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      `${m.firstName} ${m.lastName} ${m.email} ${m.memberId}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="mt-4">
      <Typography variant="h4" className="font-bold text-gym-text-primary mb-2">
        My Members
      </Typography>
      <Typography className="text-gym-text-muted mb-4">
        All registered members in the gym
      </Typography>

      <input
        type="text"
        placeholder="Search by name, email, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-gym-beige-dark bg-white px-3 py-2 text-gym-text-primary focus:border-gym-warm focus:outline-none mb-6"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gym-warm border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-gym-cream border border-gym-beige-dark rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gym-warm flex items-center justify-center text-white font-bold">
                  {m.firstName?.[0]}{m.lastName?.[0]}
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gym-text-primary leading-tight">
                    {m.firstName} {m.lastName}
                  </Typography>
                  <Typography variant="small" className="text-gym-text-muted">{m.memberId}</Typography>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gym-text-secondary">
                <span className="flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5" /> {m.email}</span>
                {m.phone && <span className="flex items-center gap-1.5"><FiPhone className="w-3.5 h-3.5" /> {m.phone}</span>}
                {m.fitnessGoals && <span className="flex items-center gap-1.5"><FiTarget className="w-3.5 h-3.5" /> {m.fitnessGoals}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <Typography className="text-gym-text-muted col-span-3 text-center py-10">
              No members found.
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
