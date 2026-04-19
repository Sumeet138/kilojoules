import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "architecture",label: "Architecture" },
  { id: "rbac",        label: "RBAC" },
  { id: "auth-flow",   label: "Auth Flow" },
  { id: "frontend",    label: "Frontend" },
  { id: "backend",     label: "Backend" },
  { id: "database",    label: "Database" },
  { id: "api",         label: "API Reference" },
  { id: "stack",       label: "Tech Stack" },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SMALL HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Tag({ children, color = "gray" }) {
  const c = {
    gray:   "bg-gray-100 text-gray-600",
    blue:   "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    green:  "bg-green-50 text-green-700 ring-1 ring-green-200",
    amber:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    red:    "bg-red-50 text-red-600 ring-1 ring-red-200",
    purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    rose:   "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${c[color]}`}>{children}</span>;
}

function H2({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-gray-900 mb-1 mt-14 first:mt-0 flex items-center gap-3">
      <span className="w-1 h-6 rounded-full bg-orange-400 flex-shrink-0" />
      {children}
    </h2>
  );
}

function H3({ children }) {
  return <h3 className="text-base font-semibold text-gray-800 mt-8 mb-3">{children}</h3>;
}

function P({ children }) {
  return <p className="text-sm text-gray-500 leading-relaxed mb-4">{children}</p>;
}

function Divider() {
  return <hr className="my-10 border-gray-100" />;
}

function Code({ children }) {
  return <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[12px] font-mono">{children}</code>;
}

function DarkBlock({ children }) {
  return (
    <div className="bg-gray-950 rounded-xl p-4 font-mono text-[12px] leading-relaxed overflow-x-auto mb-4">
      {children}
    </div>
  );
}

function Table({ head, rows, className = "" }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-200 mb-6 ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Check({ yes }) {
  return yes
    ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-[11px] font-bold">âœ“</span>
    : <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-300 text-[11px]">â€“</span>;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SECTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionOverview() {
  return (
    <section>
      <H2 id="overview">Overview</H2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        <strong className="text-gray-800">Kilojoules</strong> is a full-stack gym management system that connects three user roles â€” Members, Trainers, and Admins â€” through a React SPA, a Spring Boot REST API, and a MySQL relational database.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          ["3",   "User Roles",       "Member Â· Trainer Â· Admin"],
          ["40+", "REST Endpoints",   "Across 12 controllers"],
          ["12",  "Database Tables",  "Relational MySQL schema"],
          ["24+", "Frontend Pages",   "Lazy-loaded components"],
          ["11",  "Redux Slices",     "Per-feature state"],
          ["2",   "Route Guards",     "Protected + Guest"],
        ].map(([val, label, note]) => (
          <div key={label} className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="text-2xl font-extrabold text-gray-900">{val}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">{label}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{note}</div>
          </div>
        ))}
      </div>

      <H3>Demo Credentials</H3>
      <DarkBlock>
        <div className="space-y-1">
          {[
            ["member",  "arjun_sharma",  "Demo@1234", "/dashboard/member/home"],
            ["trainer", "rohit_trainer", "Demo@1234", "/dashboard/trainer/home"],
            ["admin",   "vikram_admin",  "Demo@1234", "/dashboard/admin/home"],
          ].map(([role, user, pass, path]) => (
            <div key={role} className="flex flex-wrap gap-x-3 gap-y-0.5">
              <span className="text-orange-400 font-semibold w-14">{role}</span>
              <span className="text-gray-300">{user}</span>
              <span className="text-gray-500">/</span>
              <span className="text-emerald-400">{pass}</span>
              <span className="text-gray-600 ml-auto text-[11px]">{path}</span>
            </div>
          ))}
        </div>
      </DarkBlock>
    </section>
  );
}

function SectionArchitecture() {
  return (
    <section>
      <Divider />
      <H2 id="architecture">System Architecture</H2>
      <P>Three-tier architecture â€” Presentation (React SPA) â†’ Business Logic (Spring Boot) â†’ Data (MySQL).</P>

      <div className="space-y-3 mb-8">
        {/* Tier 1 */}
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Tier 1 â€” Presentation</span>
            <span className="ml-auto font-mono text-[11px] text-blue-400">localhost:5173</span>
          </div>
          <div className="font-semibold text-blue-900 text-sm mb-2">React 18 SPA</div>
          <div className="flex flex-wrap gap-1.5">
            {["Vite 4","Redux Toolkit","React Router 6","Axios","Tailwind CSS","Material Tailwind","React Icons","ApexCharts"].map(t => (
              <span key={t} className="bg-white text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-1 py-1">
            <div className="w-px h-4 bg-gray-300" />
            <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">HTTP / REST JSON Â· Axios Â· /api/*</span>
            <div className="w-px h-4 bg-gray-300" />
            <span className="text-gray-300 text-xs">â†“</span>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Tier 2 â€” Business Logic</span>
            <span className="ml-auto font-mono text-[11px] text-emerald-500">localhost:8080</span>
          </div>
          <div className="font-semibold text-emerald-900 text-sm mb-2">Spring Boot 3.2 REST API</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
            {[
              ["Controllers (12)", "Route mapping, request validation, HTTP responses"],
              ["Services (13)", "Business rules, BMI calc, capacity checks, OTP"],
              ["Repositories (12)", "Spring Data JPA â€” CRUD + custom queries"],
            ].map(([name, note]) => (
              <div key={name} className="bg-white rounded-lg p-2.5 border border-emerald-100">
                <div className="font-semibold text-emerald-800">{name}</div>
                <div className="text-gray-400 mt-0.5 leading-tight">{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-1 py-1">
            <div className="w-px h-4 bg-gray-300" />
            <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">Hibernate ORM Â· JDBC Â· port 3306</span>
            <div className="w-px h-4 bg-gray-300" />
            <span className="text-gray-300 text-xs">â†“</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="border border-purple-200 bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Tier 3 â€” Data</span>
            <span className="ml-auto font-mono text-[11px] text-purple-400">schema: gym</span>
          </div>
          <div className="font-semibold text-purple-900 text-sm mb-2">MySQL 8 Database</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
            {["members","trainers","admins","fitness_classes","class_bookings","membership_plans","member_memberships","bmi_records","workout_history","diet_plans","transactions","notifications"].map(t => (
              <span key={t} className="font-mono text-[10px] text-purple-600 bg-white border border-purple-100 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <H3>Role Routing</H3>
      <P>Each authenticated role has its own isolated dashboard URL namespace, guarded by <Code>ProtectedRoute</Code>.</P>
      <DarkBlock>
        {[
          {role:"member",  color:"text-amber-400",  path:"/dashboard/member/home",  cred:"arjun_sharma"},
          {role:"trainer", color:"text-emerald-400", path:"/dashboard/trainer/home", cred:"rohit_trainer"},
          {role:"admin",   color:"text-rose-400",    path:"/dashboard/admin/home",   cred:"vikram_admin"},
        ].map(({role,color,path,cred})=>(
          <div key={role} className="flex items-center gap-3 mb-1 last:mb-0">
            <span className={`${color} font-bold w-16`}>{role}</span>
            <span className="text-gray-300">{path}</span>
            <span className="ml-auto text-gray-500 text-[11px]">{cred}</span>
          </div>
        ))}
      </DarkBlock>
    </section>
  );
}

function SectionRBAC() {
  const features = [
    ["View own dashboard",           true,  true,  true ],
    ["Register & login",             true,  true,  true ],
    ["Forgot password (OTP email)",  true,  true,  true ],
    ["Edit own profile",             true,  true,  true ],
    ["View notifications",           true,  true,  true ],
    ["Book a fitness class",         true,  false, false],
    ["Cancel own booking",           true,  false, false],
    ["Log workout history",          true,  false, false],
    ["Record BMI",                   true,  false, false],
    ["View BMI history",             true,  false, false],
    ["View assigned diet plans",     true,  false, false],
    ["Subscribe to membership plan", true,  false, false],
    ["View own transactions",        true,  false, false],
    ["Create & manage classes",      false, true,  false],
    ["Mark class attendance",        false, true,  false],
    ["Create diet plans for members",false, true,  false],
    ["View assigned members",        false, true,  false],
    ["Manage all members",           false, false, true ],
    ["Manage all trainers",          false, false, true ],
    ["Manage all classes",           false, false, true ],
    ["Create membership plans",      false, false, true ],
    ["View all transactions",        false, false, true ],
    ["Send system notifications",    false, false, true ],
    ["Delete any account",           false, false, true ],
  ];

  return (
    <section>
      <Divider />
      <H2 id="rbac">Role-Based Access Control</H2>
      <P>Every frontend route is wrapped with <Code>ProtectedRoute</Code> that checks <Code>localStorage.userRole</Code> and redirects on mismatch. The table below defines the permission boundary for each role.</P>

      <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Permission</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-amber-600 uppercase tracking-wide">Member</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-600 uppercase tracking-wide">Trainer</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-rose-500 uppercase tracking-wide">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {features.map(([feat, m, t, a]) => (
              <tr key={feat} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-gray-700">{feat}</td>
                <td className="px-4 py-2.5 text-center"><Check yes={m} /></td>
                <td className="px-4 py-2.5 text-center"><Check yes={t} /></td>
                <td className="px-4 py-2.5 text-center"><Check yes={a} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Role Responsibilities</H3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {role:"Member",  color:"border-amber-200 bg-amber-50",   tc:"text-amber-700",  desc:"Self-service health portal. Track BMI, log workouts, book classes, subscribe to plans, view diet plans assigned by trainer."},
          {role:"Trainer", color:"border-emerald-200 bg-emerald-50",tc:"text-emerald-700",desc:"Content creator. Creates and manages fitness classes, marks attendance, creates diet plans for assigned members."},
          {role:"Admin",   color:"border-rose-200 bg-rose-50",     tc:"text-rose-600",   desc:"Full system access. Manages all users, classes, membership plans, views all transactions, broadcasts notifications."},
        ].map(({role,color,tc,desc})=>(
          <div key={role} className={`rounded-xl border p-4 ${color}`}>
            <div className={`font-bold text-sm mb-2 ${tc}`}>{role}</div>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionAuthFlow() {
  return (
    <section>
      <Divider />
      <H2 id="auth-flow">Authentication & Route Guards</H2>

      <H3>Login Flow</H3>
      <div className="mb-6 space-y-0">
        {[
          ["1", "User submits credentials",              "username + password on sign-in form"],
          ["2", "Redux async thunk dispatched",          "loginMemberThunk / loginTrainerThunk / loginAdminThunk"],
          ["3", "POST to Spring Boot API",               "/api/{role}/login â€” returns full user JSON"],
          ["4", "Redux state updated",                   "currentMember / currentTrainer / currentAdmin"],
          ["5", "localStorage populated",               "memberId  Â·  memberData  Â·  userRole"],
          ["6", "React Router navigates",               "/dashboard/{role}/home via useNavigate"],
        ].map(([n, label, detail], i, arr) => (
          <div key={n} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{n}</div>
              {i < arr.length-1 && <div className="w-px h-5 bg-gray-200 my-0.5"/>}
            </div>
            <div className="pb-4">
              <div className="text-sm font-medium text-gray-800">{label}</div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">{detail}</div>
            </div>
          </div>
        ))}
      </div>

      <H3>ProtectedRoute</H3>
      <P>Wraps every <Code>/dashboard/*</Code> route. Checks <Code>localStorage.userRole</Code> before rendering.</P>
      <DarkBlock>
        <div className="text-gray-500 mb-2">{"// utils/ProtectedRoute.js"}</div>
        <div><span className="text-purple-400">if</span> <span className="text-gray-300">(!userRole)</span></div>
        <div className="pl-4 text-gray-400">{"â†’ "}<span className="text-blue-400">{"<Navigate to='/auth' replace />"}</span></div>
        <div><span className="text-purple-400">if</span> <span className="text-gray-300">(userRole !== allowedRole)</span></div>
        <div className="pl-4 text-gray-400">{"â†’ "}<span className="text-blue-400">{"<Navigate to='/dashboard/{role}/home' replace />"}</span></div>
        <div><span className="text-purple-400">else</span></div>
        <div className="pl-4 text-emerald-400">{"â†’ render children âœ“"}</div>
      </DarkBlock>

      <H3>GuestRoute</H3>
      <P>Wraps the entire <Code>/auth</Code> layout. Redirects logged-in users away from sign-in/sign-up pages.</P>
      <DarkBlock>
        <div className="text-gray-500 mb-2">{"// utils/ProtectedRoute.js â€” GuestRoute"}</div>
        <div><span className="text-purple-400">if</span> <span className="text-gray-300">(userRole exists)</span></div>
        <div className="pl-4 text-gray-400">{"â†’ "}<span className="text-blue-400">{"<Navigate to='/dashboard/{role}/home' replace />"}</span></div>
        <div><span className="text-purple-400">else</span></div>
        <div className="pl-4 text-emerald-400">{"â†’ render auth page âœ“"}</div>
      </DarkBlock>

      <H3>localStorage Session Keys</H3>
      <Table
        head={["Key", "Value", "Purpose"]}
        rows={[
          [<Code>memberId</Code>,   "Numeric DB id",     "Used in every API call as path/query param"],
          [<Code>memberData</Code>, "Full user JSON",    "Populates profile, name, avatar in the UI"],
          [<Code>userRole</Code>,   "member|trainer|admin", "Drives route guard decisions + sidenav config"],
        ]}
      />
    </section>
  );
}

function SectionFrontend() {
  return (
    <section>
      <Divider />
      <H2 id="frontend">Frontend Architecture</H2>
      <P>Single-page application built with React 18 and Vite. State is managed globally via Redux Toolkit; routing is handled by React Router 6 with lazy-loaded pages.</P>

      <H3>Route Tree</H3>
      <DarkBlock>
        {[
          {d:0, t:"/",                                  c:"text-gray-500"},
          {d:1, t:"â†’ /auth  [GuestRoute + Auth layout]", c:"text-blue-400"},
          {d:2, t:"index  LoginTypeSelection",          c:"text-gray-400"},
          {d:2, t:"member/sign-in   member/sign-up",    c:"text-gray-400"},
          {d:2, t:"trainer/sign-in  trainer/sign-up",   c:"text-gray-400"},
          {d:2, t:"admin/sign-in    admin/sign-up",     c:"text-gray-400"},
          {d:2, t:"forgot-password",                    c:"text-gray-400"},
          {d:1, t:"â†’ /dashboard/member  [ProtectedRoute, role=member]", c:"text-amber-400"},
          {d:2, t:"home  book-classes  bookings  bmi  workouts  diet-plans  transactions  notifications  profile", c:"text-gray-400"},
          {d:1, t:"â†’ /dashboard/trainer [ProtectedRoute, role=trainer]", c:"text-emerald-400"},
          {d:2, t:"home  classes  attendance  diet-plans  members  notifications  profile", c:"text-gray-400"},
          {d:1, t:"â†’ /dashboard/admin  [ProtectedRoute, role=admin]",   c:"text-rose-400"},
          {d:2, t:"home  members  trainers  classes  memberships  transactions  notifications  profile", c:"text-gray-400"},
          {d:1, t:"â†’ /system-design",                  c:"text-purple-400"},
          {d:1, t:"â†’ *  â†’  /auth  (fallback)",         c:"text-gray-600"},
        ].map(({d,t,c},i)=>(
          <div key={i} className={`${c} leading-relaxed`} style={{paddingLeft:`${d*16}px`}}>{t}</div>
        ))}
      </DarkBlock>

      <H3>Redux Store â€” 11 Slices</H3>
      <Table
        head={["Slice", "State", "Thunks"]}
        rows={[
          [<Tag color="purple">memberSlice</Tag>,         "currentMember, loading, error",          "loginMemberThunk, fetchMemberById"],
          [<Tag color="purple">trainerSlice</Tag>,        "currentTrainer, trainers[], loading",     "loginTrainerThunk, fetchAllTrainers"],
          [<Tag color="purple">adminSlice</Tag>,          "currentAdmin, loading, error",            "loginAdminThunk, fetchAdminById"],
          [<Tag color="purple">classSlice</Tag>,          "classes[], loading, error",               "fetchFitnessClasses, createClass"],
          [<Tag color="purple">bookingSlice</Tag>,        "bookings[], loading, error",              "fetchMemberBookings, bookClassThunk"],
          [<Tag color="purple">bmiSlice</Tag>,            "records[], loading, error",               "fetchBMIHistory, recordBMIThunk"],
          [<Tag color="purple">workoutHistorySlice</Tag>, "workouts[], loading, error",              "fetchWorkouts, logWorkoutThunk"],
          [<Tag color="purple">dietPlanSlice</Tag>,       "dietPlans[], loading, error",             "fetchMemberDietPlans, createDietPlanThunk"],
          [<Tag color="purple">membershipSlice</Tag>,     "memberships[], activeMembership",         "fetchMemberships, subscribeToPlanThunk"],
          [<Tag color="purple">transactionSlice</Tag>,    "transactions[], loading",                 "fetchMemberTransactions"],
          [<Tag color="purple">notificationSlice</Tag>,   "notifications[], loading",                "fetchNotifications, markReadThunk"],
        ]}
      />

      <H3>Component Hierarchy</H3>
      <DarkBlock>
        {[
          {d:0,t:"App.jsx",                              c:"text-white font-semibold"},
          {d:1,t:"<Provider store={store}>",             c:"text-purple-400"},
          {d:2,t:"<RouterProvider>",                     c:"text-blue-400"},
          {d:3,t:"Auth layout  (split-screen hero + form panel)", c:"text-blue-300"},
          {d:4,t:"<Outlet>  â†’  SignIn / SignUp / Forgot", c:"text-gray-400"},
          {d:3,t:"Dashboard layout  (sidenav + navbar + outlet)", c:"text-amber-400"},
          {d:4,t:"<Sidenav>  logo â†’ role home Â· nav links", c:"text-gray-400"},
          {d:4,t:"<DashboardNavbar>  breadcrumbs Â· profile", c:"text-gray-400"},
          {d:4,t:"<Outlet>  â†’  page content",            c:"text-gray-400"},
          {d:5,t:"StatisticsCard Â· Charts Â· Tables",     c:"text-gray-600"},
        ].map(({d,t,c},i)=>(
          <div key={i} className={`${c} leading-relaxed`} style={{paddingLeft:`${d*16}px`}}>{t}</div>
        ))}
      </DarkBlock>
    </section>
  );
}

function SectionBackend() {
  return (
    <section>
      <Divider />
      <H2 id="backend">Backend Architecture</H2>
      <P>Layered Spring Boot application following Controller â†’ Service â†’ Repository pattern. Each domain has its own controller, service, and JPA repository.</P>

      <H3>Controllers</H3>
      <Table
        head={["Controller", "Base Path", "Key Endpoints"]}
        rows={[
          ["MemberController",          "/api/members",          "register, login, forgot-password, CRUD"],
          ["TrainerController",         "/api/trainers",         "register, login, CRUD"],
          ["AdminController",           "/api/admin",            "register, login, CRUD"],
          ["FitnessClassController",    "/api/fitness-classes",  "create, update, list, trainer filter"],
          ["ClassBookingController",    "/api/bookings",         "book, cancel, attend, member/class views"],
          ["BMIRecordController",       "/api/bmi",              "record, history, recent"],
          ["WorkoutHistoryController",  "/api/workout-history",  "log, list by member, delete"],
          ["DietPlanController",        "/api/diet-plans",       "create by trainer, list, update"],
          ["MembershipPlanController",  "/api/membership-plans", "admin CRUD, deactivate"],
          ["MemberMembershipController","/api/memberships",      "subscribe, cancel, active check"],
          ["TransactionController",     "/api/transactions",     "record, list by member, list all"],
          ["NotificationController",    "/api/notifications",    "create, list, mark-read, delete"],
        ]}
      />

      <H3>Key Services</H3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {[
          ["BMIRecordService",    "Auto-calculates BMI from height/weight, categorizes as UNDERWEIGHT / NORMAL / OVERWEIGHT / OBESE"],
          ["ClassBookingService", "Validates capacity before booking, manages BOOKED â†’ ATTENDED â†’ CANCELLED state machine"],
          ["EmailService",       "Sends OTP via Spring Mail + Gmail SMTP; OTP expires after 10 minutes"],
          ["MemberService",      "Login, password reset via OTP, profile update with optional image upload"],
        ].map(([name, desc]) => (
          <div key={name} className="border border-gray-200 rounded-xl p-3 bg-white">
            <div className="font-mono text-[12px] font-semibold text-gray-800 mb-1">{name}</div>
            <div className="text-[12px] text-gray-500 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      <H3>Configuration</H3>
      <Table
        head={["Class", "Purpose"]}
        rows={[
          [<Code>CorsConfig</Code>,    "Allows all origins from localhost:5173, maps /api/**"],
          [<Code>EmailConfig</Code>,   "Gmail SMTP via Spring Mail â€” host: smtp.gmail.com, port: 587"],
          [<Code>FirebaseConfig</Code>,"Placeholder for future cloud storage integration"],
        ]}
      />

      <H3>Critical Fix â€” @JsonIgnore on Lazy Relations</H3>
      <P>All <Code>@ManyToOne(FetchType.LAZY)</Code> member/trainer fields had Jackson serialization failures outside a Hibernate session (<em>"could not initialize proxy â€” no Session"</em>). Fixed by adding <Code>@JsonIgnore</Code> to all lazy entity relationships.</P>
      <DarkBlock>
        <div className="text-gray-500 mb-2">{"// Applied to: BMIRecord, WorkoutHistory, DietPlan, Transaction, ClassBooking"}</div>
        <div><span className="text-blue-400">@JsonIgnore</span></div>
        <div><span className="text-blue-400">@ManyToOne</span><span className="text-gray-300">{"(fetch = FetchType.LAZY)"}</span></div>
        <div><span className="text-blue-400">@JoinColumn</span><span className="text-gray-300">{"(name = \"member_id\")"}</span></div>
        <div><span className="text-purple-400">private</span> <span className="text-emerald-400">Member</span> <span className="text-gray-300">member;</span></div>
      </DarkBlock>
    </section>
  );
}

function SectionDatabase() {
  const [open, setOpen] = useState(null);
  const tables = [
    {name:"members",           color:"bg-amber-500",  cols:["id PK","memberId UQ","username UQ","email UQ","password","firstName","lastName","phone","dob","age","gender","heightCm","weightKg","fitnessGoals","healthConditions","trainerPreference","imageUrl","otp","otpExpiry","createdAt","updatedAt"]},
    {name:"trainers",          color:"bg-emerald-500",cols:["id PK","trainerId UQ","username UQ","email UQ","password","firstName","lastName","phone","specialization","certificationLevel","bio","imageUrl","otp","otpExpiry","createdAt","updatedAt"]},
    {name:"admins",            color:"bg-rose-500",   cols:["id PK","adminId UQ","username UQ","email UQ","password","firstName","lastName","phone","createdAt","updatedAt"]},
    {name:"membership_plans",  color:"bg-blue-500",   cols:["id PK","planName","planType","price","durationDays","description","isActive","createdAt"]},
    {name:"member_memberships",color:"bg-indigo-500", cols:["id PK","member_id FK","plan_id FK","startDate","endDate","status","paymentStatus","createdAt"]},
    {name:"fitness_classes",   color:"bg-teal-500",   cols:["id PK","className","classType","trainer_id FK","scheduledDay","scheduledTime","durationMinutes","capacity","currentEnrollment","description","isActive","createdAt","updatedAt"]},
    {name:"class_bookings",    color:"bg-cyan-500",   cols:["id PK","member_id FK","fitness_class_id FK","bookingDate","status","createdAt"]},
    {name:"bmi_records",       color:"bg-orange-500", cols:["id PK","member_id FK","heightCm","weightKg","bmi","category","recordDate","notes","createdAt"]},
    {name:"workout_history",   color:"bg-yellow-600", cols:["id PK","member_id FK","trainer_id FK","workoutDate","exerciseName","sets","reps","weightKg","durationMinutes","notes","createdAt"]},
    {name:"diet_plans",        color:"bg-lime-600",   cols:["id PK","member_id FK","trainer_id FK","planName","description","totalCalories","proteinGrams","carbsGrams","fatsGrams","createdAt","updatedAt"]},
    {name:"transactions",      color:"bg-purple-500", cols:["id PK","member_id FK","transactionType","amount","description","transactionDate","paymentMethod","status","createdAt"]},
    {name:"notifications",     color:"bg-gray-500",   cols:["id PK","title","message","recipientType","isRead","createdAt"]},
  ];

  const rels = [
    "members        1 â”€â”€â”€â”€â”€â”€< member_memberships",
    "membership_plans 1 â”€â”€â”€â”€< member_memberships",
    "members        1 â”€â”€â”€â”€â”€â”€< class_bookings",
    "fitness_classes 1 â”€â”€â”€â”€â”€< class_bookings",
    "trainers       1 â”€â”€â”€â”€â”€â”€< fitness_classes",
    "members        1 â”€â”€â”€â”€â”€â”€< bmi_records",
    "members        1 â”€â”€â”€â”€â”€â”€< workout_history",
    "trainers       1 â”€â”€â”€â”€â”€â”€< workout_history  (nullable)",
    "members        1 â”€â”€â”€â”€â”€â”€< diet_plans",
    "trainers       1 â”€â”€â”€â”€â”€â”€< diet_plans       (nullable)",
    "members        1 â”€â”€â”€â”€â”€â”€< transactions",
  ];

  return (
    <section>
      <Divider />
      <H2 id="database">Database Schema</H2>
      <P>12 fully relational MySQL tables. Schema is managed by Hibernate DDL auto on startup. Click any table to expand columns.</P>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
        {tables.map(({name, color, cols}) => (
          <div key={name} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button onClick={() => setOpen(open===name ? null : name)}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-[11px] font-mono font-semibold text-gray-700 truncate">{name}</span>
              <span className="ml-auto text-gray-300 text-[10px]">{open===name ? "â–²" : "â–¼"}</span>
            </button>
            {open === name && (
              <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 max-h-52 overflow-y-auto">
                {cols.map(col => (
                  <div key={col} className="flex items-center gap-1.5 py-0.5">
                    {col.includes("PK") && <span className="text-amber-500 text-[10px] font-bold flex-shrink-0">PK</span>}
                    {col.includes("FK") && <span className="text-blue-400 text-[10px] font-bold flex-shrink-0">FK</span>}
                    {col.includes("UQ") && <span className="text-emerald-500 text-[10px] font-bold flex-shrink-0">UQ</span>}
                    {!col.includes("PK") && !col.includes("FK") && !col.includes("UQ") && <span className="w-5 flex-shrink-0" />}
                    <span className="font-mono text-[11px] text-gray-600">{col.replace(/ (PK|FK|UQ)$/,"")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <H3>Entity Relationships</H3>
      <DarkBlock>
        {rels.map(r => <div key={r} className="text-gray-300 font-mono text-[12px] leading-relaxed">{r}</div>)}
      </DarkBlock>
    </section>
  );
}

function SectionAPI() {
  const [tab, setTab] = useState("auth");
  const mColor = { GET:"blue", POST:"green", PUT:"amber", DELETE:"red" };

  const groups = {
    auth: { label:"Auth", rows:[
      ["POST","/api/members/register",       "Register new member (multipart)",    "public"],
      ["POST","/api/members/login",          "Member login",                       "public"],
      ["POST","/api/members/forgot-password","Send OTP to email",                  "public"],
      ["POST","/api/members/verify-otp",     "Verify OTP",                         "public"],
      ["POST","/api/members/reset-password", "Reset password",                     "public"],
      ["POST","/api/trainers/register",      "Register trainer",                   "public"],
      ["POST","/api/trainers/login",         "Trainer login",                      "public"],
      ["POST","/api/admin/register",         "Register admin",                     "public"],
      ["POST","/api/admin/login",            "Admin login",                        "public"],
    ]},
    members: { label:"Members", rows:[
      ["GET",   "/api/members",       "List all members",         "admin"],
      ["GET",   "/api/members/{id}",  "Get member by id",         "admin/member"],
      ["PUT",   "/api/members/{id}",  "Update member profile",    "member"],
      ["DELETE","/api/members/{id}",  "Delete member",            "admin"],
    ]},
    classes: { label:"Classes", rows:[
      ["GET", "/api/fitness-classes",              "List all classes",             "all"],
      ["POST","/api/fitness-classes",              "Create class",                 "trainer"],
      ["PUT", "/api/fitness-classes/{id}",         "Update class",                 "trainer"],
      ["GET", "/api/fitness-classes/trainer/{id}", "Trainer's own classes",        "trainer"],
      ["POST","/api/bookings",                     "Book a class",                 "member"],
      ["GET", "/api/bookings/member/{id}",         "Member's bookings",            "member"],
      ["GET", "/api/bookings/class/{id}",          "Class attendees",              "trainer"],
      ["PUT", "/api/bookings/{id}/cancel",         "Cancel booking",               "member"],
      ["PUT", "/api/bookings/{id}/attend",         "Mark attended",                "trainer"],
    ]},
    health: { label:"Health", rows:[
      ["POST",  "/api/bmi",                          "Record BMI entry",           "member"],
      ["GET",   "/api/bmi/member/{id}",              "Full BMI history",           "member"],
      ["GET",   "/api/bmi/member/{id}/recent",       "Last 5 records",             "member"],
      ["POST",  "/api/workout-history",              "Log workout",                "member"],
      ["GET",   "/api/workout-history/member/{id}",  "Member's workouts",          "member"],
      ["DELETE","/api/workout-history/{id}",         "Delete workout",             "member"],
      ["POST",  "/api/diet-plans",                   "Create diet plan",           "trainer"],
      ["GET",   "/api/diet-plans/member/{id}",       "Member's diet plans",        "member/trainer"],
      ["PUT",   "/api/diet-plans/{id}",              "Update diet plan",           "trainer"],
    ]},
    plans: { label:"Memberships", rows:[
      ["GET", "/api/membership-plans",                   "List active plans",      "all"],
      ["POST","/api/membership-plans",                   "Create plan",            "admin"],
      ["PUT", "/api/membership-plans/{id}",              "Update plan",            "admin"],
      ["PUT", "/api/membership-plans/{id}/deactivate",   "Deactivate plan",        "admin"],
      ["POST","/api/memberships/subscribe",              "Subscribe to plan",      "member"],
      ["GET", "/api/memberships/member/{id}",            "Member subscriptions",   "member"],
      ["GET", "/api/memberships/active/{id}",            "Active membership",      "member"],
    ]},
    misc: { label:"Misc", rows:[
      ["POST",  "/api/transactions",              "Record transaction",            "system"],
      ["GET",   "/api/transactions/member/{id}",  "Member transactions",           "member"],
      ["GET",   "/api/transactions",              "All transactions",              "admin"],
      ["POST",  "/api/notifications",             "Create notification",           "admin"],
      ["GET",   "/api/notifications",             "Get notifications",             "all"],
      ["PUT",   "/api/notifications/{id}/read",   "Mark as read",                  "all"],
      ["DELETE","/api/notifications/{id}",        "Delete notification",           "admin"],
    ]},
  };

  return (
    <section>
      <Divider />
      <H2 id="api">API Reference</H2>
      <P>Base URL: <Code>http://localhost:8080/api</Code> Â· 40+ endpoints Â· No authentication headers required (session-based via localStorage).</P>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(groups).map(([key, {label}]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${tab===key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Method</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Endpoint</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {groups[tab].rows.map(([method, path, desc, role], i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5"><Tag color={mColor[method]}>{method}</Tag></td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-gray-700">{path}</td>
                <td className="px-4 py-2.5 text-gray-500 text-[13px]">{desc}</td>
                <td className="px-4 py-2.5"><Tag color="gray">{role}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SectionStack() {
  const stacks = [
    { layer:"Frontend",      color:"blue",   items:[
      ["React 18",          "UI framework â€” hooks, Suspense, lazy"],
      ["Vite 4",            "Build tool â€” HMR, fast ESM dev server"],
      ["Tailwind CSS 3",    "Utility-first styling"],
      ["Redux Toolkit 2",   "createSlice, createAsyncThunk, configureStore"],
      ["React Router 6",    "Client-side routing, lazy loading, Outlet"],
      ["Axios 1.7",         "HTTP client with base URL config"],
      ["React Icons 5",     "Feather icon set (Fi*)"],
      ["Material Tailwind", "Pre-built UI component library"],
      ["ApexCharts",        "Interactive charts"],
    ]},
    { layer:"Backend",       color:"emerald", items:[
      ["Spring Boot 3.2",   "Auto-config, embedded Tomcat, DevTools"],
      ["Java 17",           "LTS â€” modern language features"],
      ["Spring Data JPA",   "Repository abstraction, derived queries"],
      ["Hibernate ORM",     "Entity mapping, lazy/eager loading"],
      ["Maven",             "Build system, dependency management"],
      ["Lombok",            "@Data @NoArgsConstructor â€” boilerplate"],
      ["Jackson",           "JSON serialization, @JsonIgnore"],
      ["Spring Mail",       "Gmail SMTP â€” OTP email delivery"],
    ]},
    { layer:"Database & Tools", color:"purple", items:[
      ["MySQL 8.0",         "Relational DB â€” XAMPP local instance"],
      ["JPA DDL auto",      "Schema auto-created/updated on startup"],
      ["H2 (test scope)",   "In-memory DB for JUnit tests"],
      ["Git + GitHub",      "Version control, remote at github.com/Sumeet138/kilojoules"],
      ["XAMPP",             "Local Apache + MySQL environment"],
    ]},
  ];
  const borderMap = { blue:"border-blue-200", emerald:"border-emerald-200", purple:"border-purple-200" };
  const bgMap    = { blue:"bg-blue-50",     emerald:"bg-emerald-50",     purple:"bg-purple-50"     };
  const dotMap   = { blue:"bg-blue-500",    emerald:"bg-emerald-500",    purple:"bg-purple-500"    };
  const titleMap = { blue:"text-blue-700",  emerald:"text-emerald-700",  purple:"text-purple-700"  };

  return (
    <section>
      <Divider />
      <H2 id="stack">Tech Stack</H2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stacks.map(({layer, color, items}) => (
          <div key={layer} className={`rounded-xl border ${borderMap[color]} ${bgMap[color]} overflow-hidden`}>
            <div className={`px-4 py-3 border-b border-white/60 font-bold text-sm ${titleMap[color]}`}>{layer}</div>
            <div className="p-3 space-y-1.5">
              {items.map(([name, note]) => (
                <div key={name} className="bg-white rounded-lg px-3 py-2 flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotMap[color]}`} />
                  <div>
                    <span className="text-[12px] font-semibold text-gray-800">{name}</span>
                    <span className="text-[11px] text-gray-400 ml-1.5">{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SystemDesign() {
  const [active, setActive] = useState("overview");
  const userRole = localStorage.getItem("userRole");
  const backLink = userRole ? `/dashboard/${userRole}/home` : "/auth";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* â”€â”€ Top bar â”€â”€ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm leading-none">K</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">Kilojoules</span>
          <span className="text-gray-300 text-sm">/</span>
          <span className="text-gray-500 text-sm">System Design</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a href="https://github.com/Sumeet138/kilojoules" target="_blank" rel="noreferrer"
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
            GitHub â†—
          </a>
          <Link to={backLink}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
            â† Back to App
          </Link>
        </div>
      </header>

      <div className="flex pt-14">

        {/* â”€â”€ Left sidebar â”€â”€ */}
        <aside className="hidden lg:flex flex-col fixed top-14 left-0 bottom-0 w-56 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">On this page</p>
            <nav className="space-y-0.5">
              {TOC.map(({ id, label }) => (
                <a key={id} href={`#${id}`}
                  onClick={() => setActive(id)}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    active === id
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* â”€â”€ Main content â”€â”€ */}
        <main className="flex-1 lg:ml-56 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">

            {/* Page title */}
            <div className="mb-12">
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Documentation</div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">System Design</h1>
              <p className="text-gray-500 text-base">
                Complete technical documentation for the Kilojoules Gym Management System â€” architecture, RBAC, auth flow, API reference, database schema, and tech stack.
              </p>
            </div>

            <SectionOverview />
            <SectionArchitecture />
            <SectionRBAC />
            <SectionAuthFlow />
            <SectionFrontend />
            <SectionBackend />
            <SectionDatabase />
            <SectionAPI />
            <SectionStack />

            <Divider />
            <p className="text-center text-xs text-gray-400 pb-8">
              Kilojoules Â· React 18 + Spring Boot 3.2 + MySQL Â· Built by Sumeet Sharma
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

