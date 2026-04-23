# Kilojoules — Gym Management System
## Demo Presentation Flow (End-to-End)

> **Stack:** Spring Boot 3.2 · MySQL · React 18 · Redux Toolkit · Tailwind CSS  
> **Roles:** Admin · Trainer · Member  
> **URL:** http://localhost:5173

---

## PART 1 — ADMIN SETS UP THE GYM

> *Log in as Admin first. Admin is the gym owner/manager.*

### Step 1 · Admin Sign In
- Go to `/auth` → **Admin Login**
- Credentials: use registered admin account

### Step 2 · Create Membership Plans
**Sidebar → Memberships**
- Click **+ Add Plan**
- Create 3 plans:
  | Plan | Type | Price | Duration |
  |---|---|---|---|
  | Silver Monthly | MONTHLY | ₹999 | 30 days |
  | Gold Quarterly | QUARTERLY | ₹2499 | 90 days |
  | Diamond Annual | ANNUAL | ₹7999 | 365 days |
- Plans are now visible to members for subscription

### Step 3 · Add a Trainer
**Sidebar → Trainers**
- View existing trainers or note trainer credentials for later login
- Each trainer has: name, email, specialization, phone

### Step 4 · Create Fitness Classes
**Sidebar → Fitness Classes**
- Click **+ New Class**
- Create 2 classes:
  | Class | Type | Day | Time | Capacity | Price | Trainer |
  |---|---|---|---|---|---|---|
  | Morning Yoga Flow | YOGA | MONDAY | 06:00 | 20 | ₹500 | Assign trainer |
  | HIIT Blast | HIIT | WEDNESDAY | 07:00 | 15 | ₹700 | Assign trainer |
- Classes are now visible to members for booking

**Trainer tab → Notifications** *(auto-refreshes)*
- New notification: *"You have been assigned to teach Morning Yoga Flow (MONDAY 06:00)."*

### Step 5 · Show Notifications (Admin)
**Sidebar → Notifications**
- Admin sees system-wide notifications (booking requests will appear here live)

---

## PART 2 — MEMBER JOINS THE GYM

> *Open a new browser / incognito window. Log in as Member.*

### Step 6 · Member Sign In
- Go to `/auth` → **Member Login**

### Step 7 · Member Subscribes to a Plan
**Sidebar → Membership**
- See all available plans in colorful cards (Silver / Gold / Diamond)
- Click **Subscribe** on Gold Quarterly → Confirm modal → Subscribed!
- Active plan banner appears at top: plan name, expiry date, days remaining
- Membership history table updates below

**Admin tab → Notifications** *(auto-refreshes)*
- New notification: *"[Member Name] has subscribed to Gold Quarterly (₹2499)."*

### Step 8 · Member Books a Fitness Class
**Sidebar → Book Classes**
- See class grid with filters (type / day)
- Click **Book Now · ₹500** on Morning Yoga Flow
- Card immediately shows: **⏳ Awaiting Admin Approval**
- Success alert: *"Booking request sent! Waiting for admin approval."*

### Step 9 · Member Checks Bookings
**Sidebar → My Bookings**
- See the booking with **Awaiting Approval** yellow badge
- Summary cards: Pending / Approved / Attended / Cancelled
- **Revoke** button is available until admin acts

---

## PART 3 — ADMIN APPROVES THE BOOKING

> *Switch back to Admin tab.*

### Step 10 · Admin Sees Booking Request
**Sidebar → Notifications**
- New notification: *"[Member Name] has requested to book Morning Yoga Flow (MONDAY 06:00). Please approve or reject."*

**Sidebar → Booking Approvals** *(auto-refreshes every 30s)*
- See pending request with: Member name, Class, Trainer, Fee, Date
- Click **✓ Approve**
- Row disappears from pending list
- Transaction created (₹500 PENDING)

### Step 11 · Member & Trainer Get Notified (switch tabs)
**Member tab → Notifications**
- *"Your booking for Morning Yoga Flow (MONDAY 06:00) has been approved! ✅"*

**Member tab → My Bookings** *(auto-refreshes)*
- Status changes from **Awaiting Approval** → **Approved** (blue)
- Revoke button replaced — no more cancel option

**Member tab → Book Classes**
- Card now shows: **✓ Booked · BOOKED**

---

## PART 4 — TRAINER MANAGES THE CLASS

> *Open another tab / window. Log in as Trainer.*

### Step 12 · Trainer Sign In
- Go to `/auth` → **Trainer Login**

### Step 13 · Trainer Views & Edits Classes
**Sidebar → My Classes**
- See assigned classes as cards with:
  - Name, type, day/time, price, active status badge
  - Enrollment progress bar (e.g. 1/20 = 5%)
- Click **✏️ Edit** on Morning Yoga Flow
  - Change description, duration, capacity, price
  - Click **✓ Save Changes** — updates instantly
- Click **Toggle** icon → mark class Inactive → back to Active

### Step 14 · Trainer Takes Attendance
**Sidebar → Attendance**
- Sidebar shows deduplicated class list
- Select **Morning Yoga Flow**
- Date picker defaults to **today**
- See member who booked: *Member Name · BOOKED*
- Click **✓ Attended** → status turns green **ATTENDED**
- Click **✗ No Show** on another row → turns grey **NO_SHOW**
- Stats update: Pending / Attended / No-Show counts

**Member tab → Notifications** *(auto-refreshes)*
- New notification: *"You have been marked as attended for Morning Yoga Flow (MONDAY 06:00). Keep up the great work!"*

### Step 15 · Trainer Gets Notified
**Sidebar → Notifications**
- *"[Member Name] has been approved for Morning Yoga Flow."*

---

## PART 5 — TRAINER MANAGES DIET PLANS

### Step 16 · Member Requests a Diet Plan
**Member tab → Diet Plans**
- Click **Request Diet Plan**
- Trainer receives notification: *"[Member] has requested a diet plan."*

### Step 17 · Trainer Creates Diet Plan
**Trainer tab → Diet Plans**
- See member's request notification
- Click **+ Create Plan** → fill: title, description, goals, calories, meal plan
- Assign to member → Save

**Member tab → Notifications** *(auto-refreshes)*
- New notification: *"Your trainer has created a new diet plan: [Plan Name] (X kcal)."*

### Step 18 · Member Views Their Diet Plan
**Member tab → Diet Plans**
- New plan appears with all details from trainer
- Trainer can also edit the plan inline at any time

---

## PART 6 — ADMIN VIEWS TRANSACTIONS

### Step 19 · Admin Reviews Transactions
**Admin tab → Transactions**
- See the ₹500 transaction from the booking approval
- Shows: Member name, type (PERSONAL_TRAINER), amount, status (PENDING), date

---

## PART 7 — MEMBER TRACKS HEALTH

### Step 20 · BMI Tracker
**Member tab → BMI Tracker**
- Enter height (cm) + weight (kg) → Submit
- See BMI value, category (Normal/Overweight etc.)
- Chart shows BMI history over time

### Step 21 · Workout History
**Member tab → Workout History**
- Record a workout session
- View past sessions with duration, type, notes

---

## COMPLETE FLOW SUMMARY

```
ADMIN                          MEMBER                        TRAINER
  │                              │                              │
  ├─ Create Membership Plans      │                              │
  ├─ Create Fitness Classes ──────┼─ Browse & Subscribe Plan     │
  │   (assign trainer) ──────────│─ Browse & Book Class ────────┤
  │                              │   [⏳ Awaiting Approval]      │
  ├─ Booking Approvals ──────────┤                              │
  │   Approve / Reject           │  Notified ✅                 ├─ Notified (new enrollee)
  ├─ View Transactions           │  My Bookings → Approved      │
  │                              │                              ├─ Edit Class Details
  │                              │                              ├─ Toggle Active/Inactive
  │                              │                              ├─ Mark Attendance by Date
  │                              │                              │   ✓ Attended / ✗ No Show
  │                              ├─ Request Diet Plan ──────────┤
  │                              │                              ├─ Create/Edit Diet Plan
  │                              ├─ View Diet Plan              │
  │                              ├─ BMI Tracker                 │
  │                              └─ Workout History             │
```

---

## PART 8 — AUTOMATIC REMINDERS (Scheduled Tasks)

> *Backend runs scheduled tasks daily at 9:00 AM to send proactive reminders.*

### Class Reminders (1 Day Before)
- System automatically checks for classes scheduled for tomorrow
- Members with approved bookings receive notification:
  - *"Reminder: Your class [Class Name] is tomorrow ([DAY] at [TIME]). Don't forget!"*

### Membership Expiry Reminders (7 Days Before)
- System automatically checks for memberships expiring in exactly 7 days
- Affected members receive notification:
  - *"Your [Plan Name] membership expires in 7 days ([Date]). Renew now to continue accessing the gym!"*

---

## KEY TALKING POINTS

- **Role-based access** — 3 completely separate dashboards, protected routes
- **Approval workflow** — bookings go through admin before confirming, with full notification chain
- **Real-time feel** — all relevant pages auto-poll every 30s for status updates
- **Automatic notifications** — every major action pushes a notification to the right role(s):
  - Member subscribes → Admin notified
  - Trainer creates diet plan → Member notified
  - Trainer marks attendance → Member notified
  - Admin assigns class → Trainer notified
- **Scheduled reminders** — backend runs daily tasks at 9 AM:
  - Class reminders 1 day before
  - Membership expiry reminders 7 days before
- **Session-based attendance** — trainer marks attendance by specific date, not just "all time"
- **Deduplication** — smart frontend deduplication on class sidebar
- **Responsive UI** — works on all screen sizes

---

*System: Spring Boot 3.2 · JPA/Hibernate · MySQL · React 18 · Redux Toolkit · Vite · Tailwind CSS · Material Tailwind*
