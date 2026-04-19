import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMonitor, FiServer, FiDatabase, FiArrowDown, FiArrowRight,
  FiPackage, FiCpu, FiGrid,
  FiLock, FiCalendar, FiCheckSquare, FiActivity, FiTrendingUp,
  FiFeather, FiCreditCard, FiBell, FiUser, FiUsers,
  FiTag, FiShield, FiKey, FiLink, FiStar, FiList,
  FiSettings, FiCheckCircle, FiBriefcase, FiLayers, FiCode,
  FiGitBranch, FiAlertCircle, FiBox, FiZap, FiMaximize2,
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
    orange: "bg-orange-50 border border-orange-200 text-orange-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${map[color]}`}>
      {children}
    </span>
  );
}

function Badge({ children, color = "gray" }) {
  const map = {
    green:  "bg-emerald-100 text-emerald-700",
    red:    "bg-red-100 text-red-600",
    amber:  "bg-amber-100 text-amber-700",
    blue:   "bg-blue-100 text-blue-700",
    gray:   "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${map[color]}`}>
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

// ─── TOC ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",    label: "Overview" },
  { id: "arch",        label: "Architecture" },
  { id: "rbac",        label: "RBAC" },
  { id: "authflow",    label: "Auth Flow" },
  { id: "frontend",    label: "Frontend" },
  { id: "backend",     label: "Backend" },
  { id: "schema",      label: "DB Schema" },
  { id: "api",         label: "API Reference" },
  { id: "stack",       label: "Tech Stack" },
];

// ─── 1. Overview ─────────────────────────────────────────────────────────────

function Overview() {
  const stats = [
    { label: "User Roles",        value: "3",   note: "Member · Trainer · Admin",         color: "amber" },
    { label: "REST Endpoints",    value: "40+", note: "Across 12 controllers",             color: "blue" },
    { label: "DB Tables",         value: "12",  note: "Fully relational MySQL schema",     color: "purple" },
    { label: "Frontend Pages",    value: "24+", note: "Lazy-loaded React components",      color: "green" },
    { label: "Redux Slices",      value: "11",  note: "Per-feature state management",      color: "orange" },
    { label: "Route Guards",      value: "2",   note: "ProtectedRoute · GuestRoute",       color: "rose" },
  ];
  const colors = {
    amber:  "bg-amber-50 border-amber-200 text-amber-700",
    blue:   "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    green:  "bg-emerald-50 border-emerald-200 text-emerald-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    rose:   "bg-rose-50 border-rose-200 text-rose-700",
  };
  return (
    <section id="overview" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiZap} title="Project Overview" sub="Kilojoules — Full-stack Gym Management System" />
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-3xl">
        A three-tier web application connecting gym members, trainers, and admins. The React SPA communicates with a
        Spring Boot REST API which persists data in a MySQL relational database. Role-based access control restricts
        every frontend route and conceptually every API endpoint based on the authenticated user's role.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, note, color }) => (
          <div key={label} className={`rounded-xl border p-4 ${colors[color]}`}>
            <div className="text-2xl font-extrabold">{value}</div>
            <div className="text-xs font-semibold mt-0.5">{label}</div>
            <div className="text-[11px] opacity-70 mt-0.5">{note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 2. Architecture ─────────────────────────────────────────────────────────

function ArchFlow() {
  const roles = [
    { label: "Member",  border: "border-amber-300",   hdr: "bg-gradient-to-r from-amber-500 to-amber-600",   cred: "arjun_sharma",  Icon: FiUser,   color: "amber",
      pages: [{ Icon: FiGrid, name: "Dashboard" },{ Icon: FiCalendar, name: "Book Classes" },{ Icon: FiList, name: "My Bookings" },{ Icon: FiTrendingUp, name: "BMI Tracker" },{ Icon: FiActivity, name: "Workout Log" },{ Icon: FiFeather, name: "Diet Plans" },{ Icon: FiCreditCard, name: "Transactions" },{ Icon: FiBell, name: "Notifications" },{ Icon: FiUser, name: "Profile" }] },
    { label: "Trainer", border: "border-emerald-300",  hdr: "bg-gradient-to-r from-emerald-500 to-emerald-600", cred: "priya_trainer", Icon: FiUsers,  color: "green",
      pages: [{ Icon: FiGrid, name: "Dashboard" },{ Icon: FiActivity, name: "My Classes" },{ Icon: FiCheckSquare, name: "Attendance" },{ Icon: FiFeather, name: "Diet Plans" },{ Icon: FiUsers, name: "My Members" },{ Icon: FiBell, name: "Notifications" },{ Icon: FiUser, name: "Profile" }] },
    { label: "Admin",   border: "border-rose-300",     hdr: "bg-gradient-to-r from-rose-500 to-rose-600",     cred: "vikram_admin",  Icon: FiShield, color: "rose",
      pages: [{ Icon: FiGrid, name: "Dashboard" },{ Icon: FiUsers, name: "Members" },{ Icon: FiBriefcase, name: "Trainers" },{ Icon: FiCalendar, name: "Classes" },{ Icon: FiTag, name: "Memberships" },{ Icon: FiCreditCard, name: "Transactions" },{ Icon: FiBell, name: "Notifications" },{ Icon: FiUser, name: "Profile" }] },
  ];

  return (
    <section id="arch" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiLayers} title="Three-Tier System Architecture" sub="Browser → REST API → MySQL — complete request/response path" />
      <div className="max-w-4xl mx-auto">

        {/* Browser */}
        <div className="flex justify-center">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-md w-full max-w-md">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0"><FiMonitor className="w-5 h-5 text-white" /></div>
            <div>
              <div className="font-bold text-blue-900 text-sm">Browser Client — Presentation Layer</div>
              <div className="text-[11px] text-blue-500 font-mono mt-0.5">React 18 · Vite 4 · Redux Toolkit · React Router 6 · Tailwind CSS</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center"><div className="w-0.5 h-6 bg-blue-300" /></div>

        {/* Fork */}
        <div className="relative grid grid-cols-3 h-8">
          <div className="absolute top-0 h-0.5 bg-gray-300" style={{ left:"calc(100%/6)", right:"calc(100%/6)" }} />
          {roles.map((_, i) => <div key={i} className="flex justify-center"><div className={`w-0.5 h-full ${["bg-amber-400","bg-emerald-400","bg-rose-400"][i]} mt-px`} /></div>)}
        </div>
        <div className="grid grid-cols-3 -mt-0.5 mb-1">
          {["text-amber-400","text-emerald-400","text-rose-400"].map((cls, i) => (
            <div key={i} className="flex justify-center"><FiArrowDown className={`w-3.5 h-3.5 ${cls}`} /></div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {roles.map(({ label, border, hdr, cred, Icon: RIcon, color, pages }) => (
            <div key={label} className={`rounded-2xl border-2 ${border} overflow-hidden bg-white shadow-md`}>
              <div className={`${hdr} px-3 py-2 flex items-center gap-2`}>
                <RIcon className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm">{label}</span>
                <code className="ml-auto text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">{cred}</code>
              </div>
              <div className="p-2.5 flex flex-wrap gap-1.5">
                {pages.map(({ Icon, name }) => <Chip key={name} color={color}><Icon className="w-3 h-3" />{name}</Chip>)}
              </div>
            </div>
          ))}
        </div>

        {/* Merge */}
        <div className="relative grid grid-cols-3 h-8">
          {["bg-amber-400","bg-emerald-400","bg-rose-400"].map((cls, i) => (
            <div key={i} className="flex justify-center"><div className={`w-0.5 h-full ${cls}`} /></div>
          ))}
          <div className="absolute bottom-0 h-0.5 bg-gray-400" style={{ left:"calc(100%/6)", right:"calc(100%/6)" }} />
        </div>

        {/* HTTP label */}
        <div className="flex flex-col items-center gap-0.5 my-1">
          <div className="w-0.5 h-4 bg-gray-300" />
          <span className="text-[10px] font-mono text-gray-500 bg-white border border-gray-200 shadow-sm px-2.5 py-0.5 rounded-full">HTTP / REST JSON · Axios · /api/* · localhost:8080</span>
          <div className="w-0.5 h-4 bg-gray-300" />
          <FiArrowDown className="w-3.5 h-3.5 text-gray-400 -mt-0.5" />
        </div>

        {/* Spring Boot */}
        <div className="flex justify-center mb-1">
          <div className="w-full max-w-lg rounded-2xl border-2 border-emerald-300 bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 flex items-center gap-2">
              <FiServer className="w-5 h-5 text-white" />
              <span className="font-bold text-white">Spring Boot REST API — Business Logic Layer</span>
              <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">:8080</span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { Icon: FiSettings,    label: "Controllers (12)",  note: "Route mapping, request validation, HTTP responses" },
                { Icon: FiLayers,      label: "Services (13)",     note: "Business rules, capacity checks, BMI calculation" },
                { Icon: FiCheckCircle, label: "Repositories (12)", note: "Spring Data JPA — auto-generated CRUD + custom queries" },
                { Icon: FiBox,         label: "Entities + DTOs",   note: "12 JPA entities · 17 payload classes · Lombok" },
                { Icon: FiAlertCircle, label: "Exception Handler", note: "ResourceNotFoundException · AuthenticationException" },
              ].map(({ Icon: LI, label, note }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <LI className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-gray-800">{label}</span>
                    <span className="text-[11px] text-gray-400 ml-2">{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JPA label */}
        <div className="flex flex-col items-center gap-0.5 my-1">
          <div className="w-0.5 h-4 bg-gray-300" />
          <span className="text-[10px] font-mono text-gray-500 bg-white border border-gray-200 shadow-sm px-2.5 py-0.5 rounded-full">Hibernate ORM · JDBC · port 3306</span>
          <div className="w-0.5 h-4 bg-gray-300" />
          <FiArrowDown className="w-3.5 h-3.5 text-gray-400 -mt-0.5" />
        </div>

        {/* MySQL */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg rounded-2xl border-2 border-purple-300 bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 flex items-center gap-2">
              <FiDatabase className="w-5 h-5 text-white" />
              <span className="font-bold text-white">MySQL Database — Data Layer</span>
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
    </section>
  );
}

// ─── 3. RBAC ─────────────────────────────────────────────────────────────────

function RBAC() {
  const features = [
    { feature: "View Own Dashboard",           member: true,  trainer: true,  admin: true  },
    { feature: "Register / Login",             member: true,  trainer: true,  admin: true  },
    { feature: "Forgot Password (OTP)",        member: true,  trainer: true,  admin: true  },
    { feature: "View & Edit Own Profile",      member: true,  trainer: true,  admin: true  },
    { feature: "Book a Fitness Class",         member: true,  trainer: false, admin: false },
    { feature: "Cancel Own Booking",           member: true,  trainer: false, admin: false },
    { feature: "View Own Bookings",            member: true,  trainer: false, admin: false },
    { feature: "Log Workout History",          member: true,  trainer: false, admin: false },
    { feature: "View Own Workout History",     member: true,  trainer: false, admin: false },
    { feature: "Record BMI",                   member: true,  trainer: false, admin: false },
    { feature: "View BMI History",             member: true,  trainer: false, admin: false },
    { feature: "View Assigned Diet Plans",     member: true,  trainer: false, admin: false },
    { feature: "Subscribe to Membership Plan", member: true,  trainer: false, admin: false },
    { feature: "View Own Transactions",        member: true,  trainer: false, admin: false },
    { feature: "View Notifications",           member: true,  trainer: true,  admin: true  },
    { feature: "Create & Manage Classes",      member: false, trainer: true,  admin: false },
    { feature: "Mark Class Attendance",        member: false, trainer: true,  admin: false },
    { feature: "Create Diet Plans for Members",member: false, trainer: true,  admin: false },
    { feature: "View Assigned Members",        member: false, trainer: true,  admin: false },
    { feature: "Manage All Members",           member: false, trainer: false, admin: true  },
    { feature: "Manage All Trainers",          member: false, trainer: false, admin: true  },
    { feature: "Manage All Classes",           member: false, trainer: false, admin: true  },
    { feature: "Create Membership Plans",      member: false, trainer: false, admin: true  },
    { feature: "View All Transactions",        member: false, trainer: false, admin: true  },
    { feature: "Send Notifications",           member: false, trainer: false, admin: true  },
    { feature: "Delete Members / Trainers",    member: false, trainer: false, admin: true  },
  ];

  const Y = () => <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100"><FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /></span>;
  const N = () => <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100"><span className="w-2.5 h-0.5 bg-gray-300 rounded-full block" /></span>;

  return (
    <section id="rbac" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiShield} title="Role-Based Access Control (RBAC)" sub="Feature access matrix — who can do what" />
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
          <div className="px-4 py-3 col-span-1">Feature / Permission</div>
          <div className="px-4 py-3 text-center text-amber-600">Member</div>
          <div className="px-4 py-3 text-center text-emerald-600">Trainer</div>
          <div className="px-4 py-3 text-center text-rose-600">Admin</div>
        </div>
        {features.map(({ feature, member, trainer, admin }, idx) => (
          <div key={feature} className={`grid grid-cols-4 border-b border-gray-100 last:border-0 ${idx % 2 === 1 ? "bg-gray-50/50" : ""}`}>
            <div className="px-4 py-2.5 text-sm text-gray-700 flex items-center">{feature}</div>
            <div className="px-4 py-2.5 flex items-center justify-center">{member ? <Y /> : <N />}</div>
            <div className="px-4 py-2.5 flex items-center justify-center">{trainer ? <Y /> : <N />}</div>
            <div className="px-4 py-2.5 flex items-center justify-center">{admin ? <Y /> : <N />}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { role: "Member",  color: "amber",   Icon: FiUser,   cred: "arjun_sharma / Demo@1234",  desc: "Self-service fitness portal. Track health, book classes, manage membership." },
          { role: "Trainer", color: "emerald",  Icon: FiUsers,  cred: "rohit_trainer / Demo@1234", desc: "Content creator. Manages classes, attendance, creates diet plans for members." },
          { role: "Admin",   color: "rose",    Icon: FiShield, cred: "vikram_admin / Demo@1234",  desc: "Full system access. Manages users, plans, finances and system notifications." },
        ].map(({ role, color, Icon: RI, cred, desc }) => {
          const bg = { amber: "bg-amber-50 border-amber-200", emerald: "bg-emerald-50 border-emerald-200", rose: "bg-rose-50 border-rose-200" };
          const tc = { amber: "text-amber-700", emerald: "text-emerald-700", rose: "text-rose-700" };
          return (
            <div key={role} className={`rounded-xl border p-4 ${bg[color]}`}>
              <div className="flex items-center gap-2 mb-2">
                <RI className={`w-4 h-4 ${tc[color]}`} />
                <span className={`font-bold text-sm ${tc[color]}`}>{role}</span>
              </div>
              <code className="text-[10px] bg-white/70 border border-white px-2 py-0.5 rounded font-mono text-gray-500 block mb-2">{cred}</code>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── 4. Auth Flow ─────────────────────────────────────────────────────────────

function AuthFlow() {
  return (
    <section id="authflow" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiLock} title="Authentication & Route Guard Flow" sub="Login, session, protected routes, guest routes" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Login flow */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FiKey className="text-amber-500" />Login Flow</h3>
          <div className="flex flex-col gap-0">
            {[
              { step: "1", label: "User submits credentials", note: "username + password", color: "bg-blue-500" },
              { step: "2", label: "Redux loginThunk dispatched", note: "POST /api/{role}/login", color: "bg-indigo-500" },
              { step: "3", label: "Spring Boot validates", note: "Username + plain-text password check", color: "bg-emerald-500" },
              { step: "4", label: "Member/Trainer/Admin object returned", note: "JSON response body", color: "bg-teal-500" },
              { step: "5", label: "Redux stores currentUser", note: "Redux state updated", color: "bg-amber-500" },
              { step: "6", label: "localStorage persisted", note: "memberId · memberData · userRole", color: "bg-orange-500" },
              { step: "7", label: "Navigate to /dashboard/{role}/home", note: "React Router redirect", color: "bg-rose-500" },
            ].map(({ step, label, note, color }, i, arr) => (
              <div key={step} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center`}>{step}</div>
                  {i < arr.length - 1 && <div className="w-0.5 h-5 bg-gray-200 my-0.5" />}
                </div>
                <div className="pb-3">
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-[11px] text-gray-400 font-mono">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route guards */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><FiShield className="text-rose-500" />ProtectedRoute</h3>
            <p className="text-xs text-gray-500 mb-3">Wraps all <code className="bg-gray-100 px-1 rounded">/dashboard/*</code> routes. Checks <code className="bg-gray-100 px-1 rounded">localStorage.userRole</code>.</p>
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-400">if</span>
                <span className="text-rose-600">!userRole</span>
                <FiArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="text-blue-600">{"<Navigate to='/auth' />"}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-400">if</span>
                <span className="text-rose-600">role !== allowedRole</span>
                <FiArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="text-blue-600">{"<Navigate to='/dashboard/{role}/home' />"}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                <span className="text-gray-400">else</span>
                <FiArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="text-emerald-600">render children ✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><FiGitBranch className="text-blue-500" />GuestRoute</h3>
            <p className="text-xs text-gray-500 mb-3">Wraps the entire <code className="bg-gray-100 px-1 rounded">/auth</code> layout. Prevents logged-in users from accessing login/signup.</p>
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-400">if</span>
                <span className="text-rose-600">userRole exists</span>
                <FiArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="text-blue-600">{"<Navigate to='/dashboard/{role}/home' />"}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                <span className="text-gray-400">else</span>
                <FiArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="text-emerald-600">render auth page ✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><FiCheckSquare className="text-emerald-500" />Session Persistence</h3>
            <div className="flex flex-col gap-2 text-xs">
              {[
                ["memberId",   "Numeric DB ID used for all API calls"],
                ["memberData", "Full user JSON for name/profile display"],
                ["userRole",   "member | trainer | admin — drives routing"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <code className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono text-[11px] flex-shrink-0">{k}</code>
                  <span className="text-gray-500">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Frontend Architecture ────────────────────────────────────────────────

function FrontendArch() {
  const slices = [
    { name: "memberSlice",          state: "currentMember, loading, error",         actions: "loginMemberThunk, fetchMemberById, logoutMember" },
    { name: "trainerSlice",         state: "currentTrainer, trainers, loading",      actions: "loginTrainerThunk, fetchAllTrainers" },
    { name: "adminSlice",           state: "currentAdmin, loading, error",           actions: "loginAdminThunk, fetchAdminById" },
    { name: "classSlice",           state: "classes, loading, error",               actions: "fetchFitnessClasses, createClass, updateClass" },
    { name: "bookingSlice",         state: "bookings, loading, error",              actions: "fetchMemberBookings, bookClassThunk, cancelBookingThunk" },
    { name: "bmiSlice",             state: "records, loading, error",               actions: "fetchBMIHistory, recordBMIThunk" },
    { name: "workoutHistorySlice",  state: "workouts, loading, error",              actions: "fetchWorkouts, logWorkoutThunk, deleteWorkoutThunk" },
    { name: "dietPlanSlice",        state: "dietPlans, loading, error",             actions: "fetchMemberDietPlans, createDietPlanThunk" },
    { name: "membershipSlice",      state: "memberships, activeMembership, loading", actions: "fetchMemberships, subscribeToPlanThunk" },
    { name: "transactionSlice",     state: "transactions, loading",                 actions: "fetchMemberTransactions, fetchAllTransactions" },
    { name: "notificationSlice",    state: "notifications, loading",                actions: "fetchNotifications, markReadThunk" },
  ];

  return (
    <section id="frontend" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiMonitor} title="Frontend Architecture" sub="React 18 · Vite · Redux Toolkit · React Router 6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Routing */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FiGitBranch className="text-indigo-500" />Route Structure</h3>
          <div className="font-mono text-[11px] text-gray-600 space-y-0.5 leading-relaxed">
            {[
              { indent: 0, text: "/", color: "text-gray-400" },
              { indent: 1, text: "→ /auth  [GuestRoute + Auth layout]", color: "text-blue-500" },
              { indent: 2, text: "LoginTypeSelection (index)", color: "text-gray-500" },
              { indent: 2, text: "member/sign-in  |  member/sign-up", color: "text-gray-500" },
              { indent: 2, text: "trainer/sign-in  |  trainer/sign-up", color: "text-gray-500" },
              { indent: 2, text: "admin/sign-in  |  admin/sign-up", color: "text-gray-500" },
              { indent: 2, text: "forgot-password", color: "text-gray-500" },
              { indent: 1, text: "→ /dashboard/member  [ProtectedRoute]", color: "text-amber-500" },
              { indent: 2, text: "home · book-classes · bookings · bmi", color: "text-gray-500" },
              { indent: 2, text: "workouts · diet-plans · transactions", color: "text-gray-500" },
              { indent: 1, text: "→ /dashboard/trainer  [ProtectedRoute]", color: "text-emerald-500" },
              { indent: 2, text: "home · classes · attendance · members", color: "text-gray-500" },
              { indent: 1, text: "→ /dashboard/admin  [ProtectedRoute]", color: "text-rose-500" },
              { indent: 2, text: "home · members · trainers · classes", color: "text-gray-500" },
              { indent: 1, text: "→ /system-design", color: "text-purple-500" },
              { indent: 1, text: "→ * → /auth (fallback)", color: "text-gray-400" },
            ].map(({ indent, text, color }, i) => (
              <div key={i} style={{ paddingLeft: `${indent * 14}px` }} className={`${color}`}>{text}</div>
            ))}
          </div>
        </div>

        {/* Component Tree */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><FiCode className="text-blue-500" />Component Hierarchy</h3>
          <div className="font-mono text-[11px] text-gray-600 space-y-0.5 leading-relaxed">
            {[
              { indent: 0, text: "App.jsx", color: "text-gray-900 font-bold" },
              { indent: 1, text: "Provider (Redux store)", color: "text-purple-600" },
              { indent: 2, text: "RouterProvider", color: "text-blue-600" },
              { indent: 3, text: "Auth layout", color: "text-blue-500" },
              { indent: 4, text: "← hero panel  |  Outlet →", color: "text-gray-400" },
              { indent: 4, text: "LoginTypeSelection / SignIn / SignUp", color: "text-gray-500" },
              { indent: 3, text: "Dashboard layout", color: "text-amber-500" },
              { indent: 4, text: "Sidenav (logo + nav links)", color: "text-gray-500" },
              { indent: 4, text: "DashboardNavbar (breadcrumbs)", color: "text-gray-500" },
              { indent: 4, text: "Outlet → page content", color: "text-gray-500" },
              { indent: 5, text: "Widgets: StatisticsCard, Charts", color: "text-gray-400" },
              { indent: 5, text: "Pages: Home, BMI, Workouts…", color: "text-gray-400" },
            ].map(({ indent, text, color }, i) => (
              <div key={i} style={{ paddingLeft: `${indent * 14}px` }} className={color}>{text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Redux slices */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2"><FiBox className="text-purple-500" />Redux Toolkit — 11 Slices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500">Slice</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500">State Shape</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500">Async Thunks / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slices.map(({ name, state, actions }, i) => (
                <tr key={name} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                  <td className="px-4 py-2 font-mono text-purple-600 font-semibold whitespace-nowrap">{name}</td>
                  <td className="px-4 py-2 font-mono text-gray-500 text-[11px]">{state}</td>
                  <td className="px-4 py-2 font-mono text-gray-500 text-[11px]">{actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── 6. Backend Architecture ─────────────────────────────────────────────────

function BackendArch() {
  const layers = [
    {
      name: "Controller Layer",
      color: "border-blue-300 bg-blue-50",
      titleColor: "text-blue-700",
      Icon: FiSettings,
      items: [
        { name: "MemberController",           note: "/api/members — register, login, forgot-password, CRUD" },
        { name: "TrainerController",           note: "/api/trainers — register, login, CRUD" },
        { name: "AdminController",             note: "/api/admin — register, login, CRUD" },
        { name: "FitnessClassController",      note: "/api/fitness-classes — class management" },
        { name: "ClassBookingController",      note: "/api/bookings — book, cancel, attend" },
        { name: "BMIRecordController",         note: "/api/bmi — record, history" },
        { name: "WorkoutHistoryController",    note: "/api/workout-history — log, list, delete" },
        { name: "DietPlanController",          note: "/api/diet-plans — CRUD by trainer for member" },
        { name: "MembershipPlanController",    note: "/api/membership-plans — admin CRUD" },
        { name: "MemberMembershipController",  note: "/api/memberships — subscribe, cancel" },
        { name: "TransactionController",       note: "/api/transactions — record, list" },
        { name: "NotificationController",      note: "/api/notifications — create, read, delete" },
      ],
    },
    {
      name: "Service Layer",
      color: "border-emerald-300 bg-emerald-50",
      titleColor: "text-emerald-700",
      Icon: FiLayers,
      items: [
        { name: "MemberService",           note: "Login validation, OTP email, profile update" },
        { name: "TrainerService",           note: "Login, profile, OTP flow" },
        { name: "AdminService",             note: "Admin login, profile management" },
        { name: "FitnessClassService",      note: "Create class, capacity validation, enrollment" },
        { name: "ClassBookingService",      note: "Booking rules, status transitions, attendance" },
        { name: "BMIRecordService",         note: "BMI calculation, auto-categorization" },
        { name: "WorkoutHistoryService",    note: "Workout CRUD, per-member filtering" },
        { name: "DietPlanService",          note: "Plan creation/update by trainer, latest plan" },
        { name: "MembershipPlanService",    note: "Plan CRUD, activation toggle" },
        { name: "MemberMembershipService",  note: "Subscribe, cancel, active membership check" },
        { name: "TransactionService",       note: "Record payment, per-member history" },
        { name: "NotificationService",      note: "Broadcast, per-role filter, mark-read" },
        { name: "EmailService",             note: "OTP email via Spring Mail / Gmail SMTP" },
      ],
    },
  ];

  return (
    <section id="backend" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiServer} title="Backend Architecture" sub="Spring Boot 3.2 · Java 17 · Maven · Layered architecture" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {layers.map(({ name, color, titleColor, Icon: LI, items }) => (
          <div key={name} className={`rounded-2xl border ${color} overflow-hidden shadow-sm`}>
            <div className={`px-4 py-3 border-b border-white/50 flex items-center gap-2`}>
              <LI className={`w-4 h-4 ${titleColor}`} />
              <span className={`font-bold text-sm ${titleColor}`}>{name}</span>
              <Badge color="gray" className="ml-auto">{items.length} classes</Badge>
            </div>
            <div className="divide-y divide-white/50 max-h-64 overflow-y-auto">
              {items.map(({ name: n, note }) => (
                <div key={n} className="px-4 py-2 flex items-start gap-2">
                  <span className="font-mono text-[11px] font-semibold text-gray-700 whitespace-nowrap flex-shrink-0">{n}</span>
                  <span className="text-[11px] text-gray-400">{note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><FiSettings className="text-gray-500" />Configuration Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            { name: "CorsConfig",    note: "Allows requests from http://localhost:5173. Maps all /api/** routes." },
            { name: "EmailConfig",   note: "Gmail SMTP via Spring Mail. Used by OTP forgot-password flow." },
            { name: "FirebaseConfig",note: "Placeholder for future Firebase cloud integration (currently disabled)." },
          ].map(({ name: n, note }) => (
            <div key={n} className="bg-gray-50 rounded-xl p-3">
              <code className="text-purple-600 font-bold text-[11px]">{n}.java</code>
              <p className="text-gray-400 mt-1">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Database Schema ───────────────────────────────────────────────────────

function DatabaseSchema() {
  const [expanded, setExpanded] = useState(null);
  const entities = [
    { name: "members",            color: "bg-amber-500",   fields: ["id PK","memberId UQ","username UQ","email UQ","password","firstName","lastName","phone","dob","age","gender ENUM","heightCm","weightKg","fitnessGoals","healthConditions","trainerPreference","imageUrl","otp","otpExpiry","createdAt","updatedAt"] },
    { name: "trainers",           color: "bg-emerald-500", fields: ["id PK","trainerId UQ","username UQ","email UQ","password","firstName","lastName","phone","specialization","certificationLevel","bio","imageUrl","otp","otpExpiry","createdAt","updatedAt"] },
    { name: "admins",             color: "bg-rose-500",    fields: ["id PK","adminId UQ","username UQ","email UQ","password","firstName","lastName","phone","createdAt","updatedAt"] },
    { name: "membership_plans",   color: "bg-blue-500",    fields: ["id PK","planName","planType ENUM","price","durationDays","description","isActive","createdAt"] },
    { name: "member_memberships", color: "bg-indigo-500",  fields: ["id PK","member_id FK→members","plan_id FK→membership_plans","startDate","endDate","status ENUM","paymentStatus ENUM","createdAt"] },
    { name: "fitness_classes",    color: "bg-teal-500",    fields: ["id PK","className","classType ENUM","trainer_id FK→trainers","scheduledDay ENUM","scheduledTime","durationMinutes","capacity","currentEnrollment","description","isActive","createdAt","updatedAt"] },
    { name: "class_bookings",     color: "bg-cyan-500",    fields: ["id PK","member_id FK→members","fitness_class_id FK→fitness_classes","bookingDate","status ENUM","createdAt"] },
    { name: "bmi_records",        color: "bg-orange-500",  fields: ["id PK","member_id FK→members","heightCm","weightKg","bmi","category ENUM","recordDate","notes","createdAt"] },
    { name: "workout_history",    color: "bg-yellow-600",  fields: ["id PK","member_id FK→members","trainer_id FK→trainers","workoutDate","exerciseName","sets","reps","weightKg","durationMinutes","notes","createdAt"] },
    { name: "diet_plans",         color: "bg-lime-600",    fields: ["id PK","member_id FK→members","trainer_id FK→trainers","planName","description","totalCalories","proteinGrams","carbsGrams","fatsGrams","createdAt","updatedAt"] },
    { name: "transactions",       color: "bg-purple-500",  fields: ["id PK","member_id FK→members","transactionType ENUM","amount","description","transactionDate","paymentMethod ENUM","status ENUM","createdAt"] },
    { name: "notifications",      color: "bg-gray-500",    fields: ["id PK","title","message","recipientType ENUM","isRead","createdAt"] },
  ];

  const rels = [
    "members 1 ──< member_memberships",
    "membership_plans 1 ──< member_memberships",
    "members 1 ──< class_bookings",
    "fitness_classes 1 ──< class_bookings",
    "trainers 1 ──< fitness_classes",
    "members 1 ──< bmi_records",
    "members 1 ──< workout_history",
    "trainers 1 ──< workout_history (optional)",
    "members 1 ──< diet_plans",
    "trainers 1 ──< diet_plans (optional)",
    "members 1 ──< transactions",
  ];

  return (
    <section id="schema" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiDatabase} title="Database Schema" sub="12 MySQL tables — click any table to expand columns" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-5">
        {entities.map(({ name, color, fields }) => (
          <div key={name} className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <button onClick={() => setExpanded(expanded === name ? null : name)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-[11px] font-semibold text-gray-700 font-mono truncate">{name}</span>
              <span className="ml-auto text-gray-300 text-xs">{expanded === name ? "▲" : "▼"}</span>
            </button>
            {expanded === name && (
              <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 max-h-48 overflow-y-auto">
                {fields.map((f) => (
                  <div key={f} className="text-[11px] font-mono py-0.5 text-gray-600 flex items-center gap-1">
                    {f.includes("PK")   && <FiKey  className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                    {f.includes("FK")   && <FiLink className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                    {f.includes("UQ")   && <FiStar className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                    {f.includes("ENUM") && <FiList className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                    <span>{f.replace(" PK","").replace(/ FK.*$/,"").replace(" UQ","").replace(" ENUM","")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mb-5 text-xs text-gray-400">
        {[[FiKey,"text-amber-500","Primary Key"],[FiLink,"text-blue-400","Foreign Key"],[FiStar,"text-emerald-500","Unique"],[FiList,"text-purple-400","Enum"]].map(([Icon,cls,lbl]) => (
          <span key={lbl} className="flex items-center gap-1"><Icon className={`w-3 h-3 ${cls}`} />{lbl}</span>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><FiLink className="text-blue-400" />Entity Relationships</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {rels.map((r) => (
            <div key={r} className="text-[11px] font-mono text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">{r}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 8. API Reference ─────────────────────────────────────────────────────────

function APIReference() {
  const [open, setOpen] = useState("auth");
  const groups = [
    { id: "auth", label: "Authentication", endpoints: [
      { method: "POST", path: "/api/members/register",         desc: "Register a new member (multipart/form-data)", role: "public" },
      { method: "POST", path: "/api/members/login",            desc: "Member login → returns member JSON",          role: "public" },
      { method: "POST", path: "/api/members/forgot-password",  desc: "Send OTP to member email",                   role: "public" },
      { method: "POST", path: "/api/members/verify-otp",       desc: "Verify OTP for password reset",              role: "public" },
      { method: "POST", path: "/api/members/reset-password",   desc: "Reset password with verified OTP",           role: "public" },
      { method: "POST", path: "/api/trainers/register",        desc: "Register a new trainer",                     role: "public" },
      { method: "POST", path: "/api/trainers/login",           desc: "Trainer login",                              role: "public" },
      { method: "POST", path: "/api/admin/register",           desc: "Register a new admin",                       role: "public" },
      { method: "POST", path: "/api/admin/login",              desc: "Admin login",                                role: "public" },
    ]},
    { id: "members", label: "Members", endpoints: [
      { method: "GET",    path: "/api/members",       desc: "Get all members",              role: "admin" },
      { method: "GET",    path: "/api/members/{id}",  desc: "Get member by DB id",          role: "admin/member" },
      { method: "PUT",    path: "/api/members/{id}",  desc: "Update member profile",        role: "member" },
      { method: "DELETE", path: "/api/members/{id}",  desc: "Delete member account",        role: "admin" },
    ]},
    { id: "trainers", label: "Trainers", endpoints: [
      { method: "GET",    path: "/api/trainers",        desc: "Get all trainers",            role: "admin" },
      { method: "GET",    path: "/api/trainers/{id}",   desc: "Get trainer by id",           role: "all" },
      { method: "PUT",    path: "/api/trainers/{id}",   desc: "Update trainer profile",      role: "trainer" },
      { method: "DELETE", path: "/api/trainers/{id}",   desc: "Delete trainer account",      role: "admin" },
    ]},
    { id: "classes", label: "Classes & Bookings", endpoints: [
      { method: "GET",  path: "/api/fitness-classes",                  desc: "Get all active classes",            role: "all" },
      { method: "POST", path: "/api/fitness-classes",                  desc: "Create a class (multipart)",        role: "trainer/admin" },
      { method: "PUT",  path: "/api/fitness-classes/{id}",             desc: "Update class",                      role: "trainer" },
      { method: "GET",  path: "/api/fitness-classes/trainer/{id}",     desc: "Get trainer's own classes",         role: "trainer" },
      { method: "POST", path: "/api/bookings",                         desc: "Book a class",                      role: "member" },
      { method: "GET",  path: "/api/bookings/member/{memberId}",       desc: "Get member bookings",               role: "member" },
      { method: "GET",  path: "/api/bookings/class/{classId}",         desc: "Get class attendees",               role: "trainer" },
      { method: "PUT",  path: "/api/bookings/{id}/cancel",             desc: "Cancel booking",                    role: "member" },
      { method: "PUT",  path: "/api/bookings/{id}/attend",             desc: "Mark attended",                     role: "trainer" },
    ]},
    { id: "health", label: "Health Tracking", endpoints: [
      { method: "POST", path: "/api/bmi",                             desc: "Record new BMI entry",              role: "member" },
      { method: "GET",  path: "/api/bmi/member/{memberId}",           desc: "Full BMI history",                  role: "member" },
      { method: "GET",  path: "/api/bmi/member/{memberId}/recent",    desc: "Last 5 BMI records",                role: "member" },
      { method: "POST", path: "/api/workout-history",                 desc: "Log a workout session",             role: "member" },
      { method: "GET",  path: "/api/workout-history/member/{id}",     desc: "All workouts for member",           role: "member" },
      { method: "DELETE",path: "/api/workout-history/{id}",           desc: "Delete workout entry",              role: "member" },
    ]},
    { id: "plans", label: "Memberships & Diet", endpoints: [
      { method: "GET",  path: "/api/membership-plans",                 desc: "Get active plans",                  role: "all" },
      { method: "POST", path: "/api/membership-plans",                 desc: "Create plan",                       role: "admin" },
      { method: "PUT",  path: "/api/membership-plans/{id}",            desc: "Update plan",                       role: "admin" },
      { method: "PUT",  path: "/api/membership-plans/{id}/deactivate", desc: "Deactivate plan",                   role: "admin" },
      { method: "POST", path: "/api/memberships/subscribe",            desc: "Subscribe member to a plan",        role: "member" },
      { method: "GET",  path: "/api/memberships/member/{id}",          desc: "Get member's subscriptions",        role: "member" },
      { method: "GET",  path: "/api/memberships/active/{id}",          desc: "Active membership",                 role: "member" },
      { method: "POST", path: "/api/diet-plans",                       desc: "Create diet plan for member",       role: "trainer" },
      { method: "GET",  path: "/api/diet-plans/member/{id}",           desc: "Get member's diet plans",           role: "member/trainer" },
      { method: "PUT",  path: "/api/diet-plans/{id}",                  desc: "Update diet plan",                  role: "trainer" },
    ]},
    { id: "misc", label: "Transactions & Notifications", endpoints: [
      { method: "POST", path: "/api/transactions",                     desc: "Record a transaction",              role: "system" },
      { method: "GET",  path: "/api/transactions/member/{id}",         desc: "Member transaction history",        role: "member" },
      { method: "GET",  path: "/api/transactions",                     desc: "All transactions",                  role: "admin" },
      { method: "POST", path: "/api/notifications",                    desc: "Create notification",               role: "admin/system" },
      { method: "GET",  path: "/api/notifications",                    desc: "Get notifications",                 role: "all" },
      { method: "PUT",  path: "/api/notifications/{id}/read",          desc: "Mark as read",                      role: "all" },
      { method: "DELETE",path: "/api/notifications/{id}",              desc: "Delete notification",               role: "admin" },
    ]},
  ];

  const methodColor = { GET: "bg-blue-100 text-blue-700", POST: "bg-emerald-100 text-emerald-700", PUT: "bg-amber-100 text-amber-700", DELETE: "bg-red-100 text-red-600" };
  const roleColor = { public: "green", admin: "rose", member: "amber", trainer: "green", all: "blue", "admin/member": "amber", "trainer/admin": "green", "member/trainer": "amber", "admin/system": "rose", system: "gray" };

  return (
    <section id="api" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiCode} title="API Reference" sub="Base URL: http://localhost:8080/api — 40+ endpoints across 12 controllers" />
      <div className="flex flex-wrap gap-2 mb-4">
        {groups.map(({ id, label, endpoints }) => (
          <button key={id} onClick={() => setOpen(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${open === id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {label} <span className="opacity-50">({endpoints.length})</span>
          </button>
        ))}
      </div>
      {groups.filter(g => g.id === open).map(({ endpoints }) => (
        <div key={open} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500 w-16">Method</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500">Endpoint</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500">Description</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-500 w-28">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {endpoints.map(({ method, path, desc, role }, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold font-mono ${methodColor[method]}`}>{method}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-700">{path}</td>
                  <td className="px-4 py-2.5 text-gray-500">{desc}</td>
                  <td className="px-4 py-2.5">
                    <Badge color={roleColor[role] || "gray"}>{role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

// ─── 9. Tech Stack ────────────────────────────────────────────────────────────

function TechStack() {
  const stacks = [
    { layer: "Frontend",  icon: FiMonitor, color: "blue",   bg: "bg-blue-500",
      items: [
        { name: "React 18",         note: "UI framework with hooks & Suspense" },
        { name: "Vite 4",           note: "HMR dev server, fast ESM builds" },
        { name: "Tailwind CSS 3",   note: "Utility-first styling" },
        { name: "Redux Toolkit 2",  note: "State management, createSlice, createAsyncThunk" },
        { name: "React Router 6",   note: "Client-side routing, lazy loading" },
        { name: "Axios 1.7",        note: "HTTP client, API calls" },
        { name: "React Icons 5",    note: "Feather icon set (FI*)" },
        { name: "Material Tailwind",note: "UI component library" },
        { name: "ApexCharts",       note: "Interactive charts" },
      ]
    },
    { layer: "Backend",   icon: FiServer,  color: "emerald", bg: "bg-emerald-500",
      items: [
        { name: "Spring Boot 3.2",  note: "Auto-configuration, embedded Tomcat" },
        { name: "Java 17",          note: "LTS release, records, sealed classes" },
        { name: "Spring Data JPA",  note: "Repository abstraction, derived queries" },
        { name: "Hibernate ORM",    note: "Entity mapping, lazy/eager loading" },
        { name: "Maven",            note: "Build tool, dependency management" },
        { name: "Lombok",           note: "@Data, @Builder — boilerplate reduction" },
        { name: "Jackson",          note: "JSON serialization, @JsonIgnore" },
        { name: "Spring Mail",      note: "Gmail SMTP for OTP emails" },
        { name: "Spring DevTools",  note: "Hot reload during development" },
      ]
    },
    { layer: "Database & Tools", icon: FiDatabase, color: "purple", bg: "bg-purple-500",
      items: [
        { name: "MySQL 8.0",        note: "Relational DB, XAMPP instance" },
        { name: "JPA DDL auto",     note: "Schema created/updated on startup" },
        { name: "H2 (test)",        note: "In-memory DB for unit tests" },
        { name: "Git + GitHub",     note: "Version control, remote repo" },
        { name: "XAMPP",            note: "Local Apache + MySQL server" },
        { name: "Postman",          note: "API testing" },
      ]
    },
  ];
  const colorMap = {
    blue:   { chip: "blue",  border: "border-blue-200", bg: "bg-blue-50" },
    emerald:{ chip: "green", border: "border-emerald-200", bg: "bg-emerald-50" },
    purple: { chip: "purple",border: "border-purple-200", bg: "bg-purple-50" },
  };

  return (
    <section id="stack" className="mb-14 scroll-mt-16">
      <SectionTitle icon={FiPackage} title="Technology Stack" sub="All libraries, frameworks, and tools used in the project" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stacks.map(({ layer, icon: LI, color, bg, items }) => {
          const c = colorMap[color];
          return (
            <div key={layer} className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden shadow-sm`}>
              <div className="px-4 py-3 flex items-center gap-2 border-b border-white/50">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                  <LI className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-sm">{layer}</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {items.map(({ name, note }) => (
                  <div key={name} className="bg-white/70 rounded-lg px-3 py-2 flex items-start gap-2">
                    <span className="font-semibold text-gray-700 text-xs whitespace-nowrap">{name}</span>
                    <span className="text-[11px] text-gray-400 leading-tight">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SystemDesign() {
  const userRole = localStorage.getItem("userRole");
  const backLink = userRole ? `/dashboard/${userRole}/home` : "/auth";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <FiCpu className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Kilojoules — System Design</span>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              className="text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <Link to={backLink}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap">
          ← Back to App
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Overview />
        <ArchFlow />
        <RBAC />
        <AuthFlow />
        <FrontendArch />
        <BackendArch />
        <DatabaseSchema />
        <APIReference />
        <TechStack />
      </main>

      <footer className="border-t border-gray-200 text-center text-[11px] text-gray-400 py-5">
        Kilojoules · React 18 + Spring Boot 3.2 + MySQL · Full-Stack Gym Management System
      </footer>
    </div>
  );
}

