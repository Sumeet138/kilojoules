import { useState } from "react"; 
import { Link } from "react-router-dom";
import {
  FiMonitor, FiServer, FiDatabase, FiArrowDown,
  FiPackage, FiGitBranch, FiCpu, FiGrid,
  FiLock, FiCalendar, FiCheckSquare, FiActivity, FiTrendingUp,
  FiFeather, FiCreditCard, FiBell, FiUser, FiUsers,
  FiTag, FiShield, FiKey, FiLink, FiStar, FiList, FiMap,
  FiSettings, FiCheckCircle, FiBriefcase, FiDollarSign, FiLayers,
} from "react-icons/fi";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Chip({ children, color = "gray" }) {
  const map = {
    gray:   "bg-white border border-gray-200 text-gray-600",
    amber:  "bg-amber-50 border border-amber-200 text-amber-800",
    green:  "bg-emerald-50 border border-emerald-200 text-emerald-800",
    rose:   "bg-rose-50 border border-rose-200 text-rose-800",
    blue:   "bg-blue-50 border border-blue-200 text-blue-800",
    purple: "bg-purple-50 border border-purple-200 text-purple-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${map[color]}`}>
      {children}
    </span>
  );
}


function SectionTitle({ icon: Icon, title, sub }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="text-amber-600 w-5 h-5" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {sub && <p className="text-gray-400 text-xs ml-7">{sub}</p>}
    </div>
  );
}

// ─── Architecture Flow (graph diagram) ───────────────────────────────────────

function FlowLabel({ children }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-0.5 h-5 bg-gray-300" />
      <span className="text-[10px] font-mono text-gray-500 bg-white border border-gray-200 shadow-sm px-2.5 py-0.5 rounded-full whitespace-nowrap">
        {children}
      </span>
      <div className="w-0.5 h-5 bg-gray-300" />
      <FiArrowDown className="w-3.5 h-3.5 text-gray-400 -mt-0.5" />
    </div>
  );
}

function ArchFlow() {
  const roles = [
    {
      label: "Member",
      dropCls: "bg-amber-400",
      border: "border-amber-300",
      hdr: "bg-gradient-to-r from-amber-500 to-amber-600",
      cred: "arjun_sharma",
      Icon: FiUser,
      color: "amber",
      pages: [
        { Icon: FiGrid,       name: "Dashboard" },
        { Icon: FiCalendar,   name: "Book Classes" },
        { Icon: FiList,       name: "My Bookings" },
        { Icon: FiTrendingUp, name: "BMI Tracker" },
        { Icon: FiActivity,   name: "Workout Log" },
        { Icon: FiFeather,    name: "Diet Plans" },
        { Icon: FiCreditCard, name: "Transactions" },
        { Icon: FiBell,       name: "Notifications" },
        { Icon: FiUser,       name: "Profile" },
      ],
    },
    {
      label: "Trainer",
      dropCls: "bg-emerald-400",
      border: "border-emerald-300",
      hdr: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      cred: "priya_trainer",
      Icon: FiUsers,
      color: "green",
      pages: [
        { Icon: FiGrid,        name: "Dashboard" },
        { Icon: FiActivity,    name: "My Classes" },
        { Icon: FiCheckSquare, name: "Attendance" },
        { Icon: FiFeather,     name: "Diet Plans" },
        { Icon: FiUsers,       name: "My Members" },
        { Icon: FiBell,        name: "Notifications" },
        { Icon: FiUser,        name: "Profile" },
      ],
    },
    {
      label: "Admin",
      dropCls: "bg-rose-400",
      border: "border-rose-300",
      hdr: "bg-gradient-to-r from-rose-500 to-rose-600",
      cred: "vikram_admin",
      Icon: FiShield,
      color: "rose",
      pages: [
        { Icon: FiGrid,       name: "Dashboard" },
        { Icon: FiUsers,      name: "Members" },
        { Icon: FiBriefcase,  name: "Trainers" },
        { Icon: FiCalendar,   name: "Classes" },
        { Icon: FiTag,        name: "Memberships" },
        { Icon: FiCreditCard, name: "Transactions" },
        { Icon: FiBell,       name: "Notifications" },
        { Icon: FiUser,       name: "Profile" },
      ],
    },
  ];

  return (
    <section className="mb-14">
      <SectionTitle icon={FiLayers} title="System Architecture" sub="High-level flow — browser to database" />

      <div className="max-w-4xl mx-auto">

        {/* ── NODE: Browser ── */}
        <div className="flex justify-center">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-md w-full max-w-md">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <FiMonitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-blue-900 text-sm tracking-wide">Browser Client</div>
              <div className="text-[11px] text-blue-500 font-mono mt-0.5">React 18 · Vite 4 · Redux Toolkit · React Router 6</div>
            </div>
          </div>
        </div>

        {/* ── FORK: single line → horizontal bar → 3 colored drops ── */}
        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-blue-300" />
        </div>
        {/* Horizontal fork bar + 3 drops */}
        <div className="relative grid grid-cols-3 h-8">
          <div className="absolute top-0 h-0.5 bg-gray-300"
            style={{ left: "calc(100% / 6)", right: "calc(100% / 6)" }} />
          {roles.map(({ dropCls }, i) => (
            <div key={i} className="flex justify-center">
              <div className={`w-0.5 h-full ${dropCls} mt-px`} />
            </div>
          ))}
        </div>
        {/* Arrow tips */}
        <div className="grid grid-cols-3 -mt-0.5 mb-0.5">
          {roles.map(({ dropCls }, i) => (
            <div key={i} className="flex justify-center">
              <FiArrowDown className={`w-3.5 h-3.5 ${dropCls.replace("bg-","text-")}`} />
            </div>
          ))}
        </div>

        {/* ── NODE: Role Branch Cards ── */}
        <div className="grid grid-cols-3">
          {roles.map(({ label, border, hdr, cred, Icon: RIcon, color, pages }) => (
            <div key={label} className="px-1.5">
              <div className={`rounded-2xl border-2 ${border} overflow-hidden bg-white shadow-md`}>
                <div className={`${hdr} px-3 py-2 flex items-center gap-2`}>
                  <RIcon className="w-4 h-4 text-white" />
                  <span className="font-bold text-white text-sm">{label}</span>
                  <code className="ml-auto text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">{cred}</code>
                </div>
                <div className="p-2.5 flex flex-wrap gap-1.5">
                  {pages.map(({ Icon, name }) => (
                    <Chip key={name} color={color}>
                      <Icon className="w-3 h-3" />{name}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MERGE: 3 colored rises → horizontal bar → single line ── */}
        <div className="relative grid grid-cols-3 h-8">
          {roles.map(({ dropCls }, i) => (
            <div key={i} className="flex justify-center">
              <div className={`w-0.5 h-full ${dropCls}`} />
            </div>
          ))}
          <div className="absolute bottom-0 h-0.5 bg-gray-400"
            style={{ left: "calc(100% / 6)", right: "calc(100% / 6)" }} />
        </div>

        {/* ── CONNECTOR LABEL: HTTP ── */}
        <FlowLabel>HTTP / REST JSON · Axios · /api/*</FlowLabel>

        {/* ── NODE: Spring Boot ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="rounded-2xl border-2 border-emerald-300 bg-white shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiServer className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Spring Boot REST API</span>
                <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">:8080</span>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { Icon: FiSettings,    label: "Controllers",  note: "12 REST controllers · routes & validates" },
                  { Icon: FiLayers,      label: "Services",     note: "Business logic · rules · capacity checks" },
                  { Icon: FiCheckCircle, label: "Repositories", note: "Spring Data JPA · entity CRUD ops" },
                ].map(({ Icon: LI, label, note }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                        <LI className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-800">{label}</span>
                        <span className="text-[11px] text-gray-400 ml-2">{note}</span>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex items-center gap-2 px-4 py-px bg-gray-50">
                        <div className="w-6 flex justify-center">
                          <div className="w-px h-3 bg-emerald-200" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONNECTOR LABEL: JPA ── */}
        <FlowLabel>JPA / Hibernate ORM · JDBC · port 3306</FlowLabel>

        {/* ── NODE: MySQL ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="rounded-2xl border-2 border-purple-300 bg-white shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiDatabase className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">MySQL Database</span>
                <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">schema: gym</span>
              </div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 px-4 py-3">
                {["members","trainers","admins","fitness_classes","class_bookings","membership_plans","member_memberships","bmi_records","workout_history","diet_plans","transactions","notifications"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-gray-600 truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────

function TechStack() {
  const stacks = [
    { layer: "Frontend",  color: "bg-blue-500",   items: ["React 18","Vite 4","Tailwind CSS","Redux Toolkit","Axios","React Router 6","Material Tailwind","React Icons","ApexCharts"] },
    { layer: "Backend",   color: "bg-emerald-500", items: ["Spring Boot 3.2","Java 17","Spring Data JPA","Hibernate","Maven","Lombok","Jackson","Spring Mail"] },
    { layer: "Database",  color: "bg-purple-500",  items: ["MySQL 8","XAMPP","JPA DDL Auto","12 Tables"] },
  ];
  return (
    <section className="mb-14">
      <SectionTitle icon={FiPackage} title="Tech Stack" sub="All packages and frameworks" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stacks.map(({ layer, color, items }) => (
          <div key={layer} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className={`inline-flex items-center gap-1.5 ${color} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
              {layer}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((name) => (
                <Chip key={name}>{name}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Database Schema ──────────────────────────────────────────────────────────

function DatabaseSchema() {
  const [expanded, setExpanded] = useState(null);
  const entities = [
    { name: "members",            color: "bg-amber-500",   fields: ["id PK","username UQ","email UQ","password","firstName","lastName","phone","dob","gender","heightCm","weightKg","fitnessGoals","healthConditions","imageUrl"] },
    { name: "trainers",           color: "bg-emerald-500", fields: ["id PK","trainerId UQ","username UQ","email UQ","password","firstName","lastName","specialization","certificationLevel","bio","imageUrl"] },
    { name: "admins",             color: "bg-rose-500",    fields: ["id PK","adminId UQ","username UQ","email UQ","password","firstName","lastName","phone"] },
    { name: "membership_plans",   color: "bg-blue-500",    fields: ["id PK","planName","planType ENUM","price","durationDays","description","isActive"] },
    { name: "member_memberships", color: "bg-indigo-500",  fields: ["id PK","member_id FK","plan_id FK","startDate","endDate","status ENUM","paymentStatus ENUM"] },
    { name: "fitness_classes",    color: "bg-teal-500",    fields: ["id PK","className","classType ENUM","trainer_id FK","scheduledDay ENUM","scheduledTime","durationMinutes","capacity","currentEnrollment","isActive"] },
    { name: "class_bookings",     color: "bg-cyan-500",    fields: ["id PK","member_id FK","fitness_class_id FK","bookingDate","status ENUM"] },
    { name: "bmi_records",        color: "bg-orange-500",  fields: ["id PK","member_id FK","heightCm","weightKg","bmi","category ENUM","recordDate","notes"] },
    { name: "workout_history",    color: "bg-yellow-600",  fields: ["id PK","member_id FK","trainer_id FK","workoutDate","exerciseName","sets","reps","weightKg","durationMinutes","notes"] },
    { name: "diet_plans",         color: "bg-lime-600",    fields: ["id PK","member_id FK","trainer_id FK","planName","description","totalCalories","proteinGrams","carbsGrams","fatsGrams"] },
    { name: "transactions",       color: "bg-purple-500",  fields: ["id PK","member_id FK","transactionType ENUM","amount","description","transactionDate","paymentMethod ENUM","status ENUM"] },
    { name: "notifications",      color: "bg-gray-500",    fields: ["id PK","title","message","recipientType ENUM","isRead","createdAt"] },
  ];
  return (
    <section className="mb-14">
      <SectionTitle icon={FiDatabase} title="Database Schema" sub="12 tables — click any to expand columns" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {entities.map(({ name, color, fields }) => (
          <div key={name} className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setExpanded(expanded === name ? null : name)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-[11px] font-semibold text-gray-700 font-mono truncate">{name}</span>
              <span className="ml-auto text-gray-300 text-xs">{expanded === name ? "▲" : "▼"}</span>
            </button>
            {expanded === name && (
              <div className="border-t border-gray-100 px-3 py-2 bg-gray-50">
                {fields.map((f) => (
                  <div key={f} className="text-[11px] font-mono py-0.5 text-gray-600 flex items-center gap-1">
                    {f.includes("PK")   && <FiKey  className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                    {f.includes("FK")   && <FiLink className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                    {f.includes("UQ")   && <FiStar className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                    {f.includes("ENUM") && <FiList className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                    {f.replace(" PK","").replace(" FK","").replace(" UQ","").replace(" ENUM","")}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
        {[[FiKey,"text-amber-500","Primary Key"],[FiLink,"text-blue-400","Foreign Key"],[FiStar,"text-emerald-500","Unique"],[FiList,"text-purple-400","Enum"]].map(([Icon,cls,lbl]) => (
          <span key={lbl} className="flex items-center gap-1"><Icon className={`w-3 h-3 ${cls}`} />{lbl}</span>
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SystemDesign() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <FiCpu className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Kilojoules — System Architecture</span>
        </div>
        <Link
          to="/auth"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          ← Back to App
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <ArchFlow />
        <TechStack />
        <DatabaseSchema />
      </main>

      <footer className="border-t border-gray-200 text-center text-[11px] text-gray-400 py-5">
        Kilojoules · React + Spring Boot + MySQL
      </footer>
    </div>
  );
}

