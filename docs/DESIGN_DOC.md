# Goal Planning App — Design Document
**Version 1.0 | For Coding Agent Use**

---

## 1. Product Vision

A personal, local-first goal planning app that mirrors how humans naturally think about goals: top-down, hierarchical, and linked to daily habits. The app bridges long-term ambition with daily action — making it easy to see how what you do today connects to where you want to be in 3 years.

**Core philosophy**: Goals are outcomes. Habits are the engine. The app should make both visible, measurable, and connected.

---

## 2. Core Concepts

### 2.1 Goals vs. Habits (Critical Distinction)

These are two separate entity types with an explicit linkage. Do not conflate them.

| Dimension | Goal | Habit |
|-----------|------|-------|
| **Nature** | An outcome to achieve | A recurring process to sustain |
| **Structure** | Tree (parent → child, unlimited depth) | Flat list |
| **Timeline** | Fixed start + due date (days to years) | Ongoing, with optional end date |
| **Tracking** | KPIs + qualitative notes | KPI logs + streak counter |
| **Example** | "Reach 75kg by May 31" | "Exercise 45 mins daily" |
| **Relationship** | Has many supporting habits | Supports many goals |

A habit is not a sub-goal. It is a *supporting process* that enables a goal. Example:

```
Goal: "Reach 75kg by May 31"
├─ Supporting Habits:
│   ├─ "Exercise 45 mins" (critical) ←── separate entity, linked via junction table
│   ├─ "Track weight weekly" (important)
│   └─ "Follow meal plan" (critical)
└─ KPI: "Body Weight" (85kg → 75kg)
    └─ Milestones: 82kg by Feb, 79kg by Apr
```

### 2.2 Goal Hierarchy (Tree Structure)

Goals nest infinitely. Each sub-goal is a full Goal entity with its own KPIs, habits, and notes.

```
Long-Term Goal (1-3 years)
└─ Mid-Term Sub-Goal (quarterly/monthly)
   └─ Short-Term Sub-Goal (weekly)
      └─ Sub-Goal (daily or granular)
```

There is no enforced "yearly → monthly → weekly → daily" mapping. The user decides the resolution. The tree is defined by `parentGoalId` on each Goal.

### 2.3 KPIs (Key Performance Indicators)

Both Goals and Habits have KPIs. They differ:

- **Goal KPIs**: Outcome metrics. Example: weight (85kg → 75kg), revenue ($0 → $100k), followers (0 → 5000). Logged periodically (daily/weekly/monthly — user decides).
- **Habit KPIs**: Process metrics. Two modes:
  - **Binary**: Did it happen today? Yes/No (e.g., "Did I follow meal plan?")
  - **Measured**: A numeric value (e.g., "45 mins exercise", "3 posts published")

KPI targets can be adjusted at any time. All changes are tracked in an audit log (what changed, when, and an optional reason).

### 2.4 Milestones

User-defined expected checkpoints for a KPI. No auto-calculation. The user manually adds: "I expect my weight to be 82kg by Feb 15". The app plots actual vs. expected on a chart.

### 2.5 Streaks

Each habit KPI tracks a streak counter: consecutive days/periods the habit was completed. When broken, the user can restart. The app stores: current streak start date, current streak length, all-time longest streak, and number of times restarted. No punishment — just data.

---

## 3. Feature Specification

### 3.1 Goals

- Create a goal with: title, description, start date, due date, tags, and optional parent goal (making it a sub-goal)
- Add one or more KPIs to a goal (name, unit, start value, target value)
- Define milestones for each KPI (expected value at a given date)
- Add qualitative notes (timestamped reflections on progress)
- Link habits to a goal (with importance level: critical / important / supporting)
- Update goal status: not_started → in_progress → completed / paused / abandoned
- Change KPI target at any time (tracked in audit log with reason)
- View all sub-goals in a collapsible tree
- View which habits support this goal and their current status

**Goal types**:
- **Outcome goal**: Qualitative. Tracked via notes and binary KPIs (done/not done)
- **Target goal**: Quantitative. Tracked via numeric KPIs with start/target values

### 3.2 Habits

- Create a habit with: title, description, frequency (daily / weekly / custom), reminder time (optional), tags
- Frequency options:
  - Daily: fires every day
  - Weekly: user selects specific days (e.g., Mon/Wed/Fri)
  - Custom: cron-like expression for complex schedules
- Add one or more KPIs to a habit (binary or measured)
- Link to one or more goals with importance level
- Log habit completion daily: binary (done/not done) or measured value + optional note
- View streak counter: current streak, longest streak, restart history
- Pause or abandon a habit without deleting it

### 3.3 Calendar Views (Four Resolutions)

Inspired by Google Calendar's zoom model. The user can switch between views via top tab or button bar.

**Day View** (default on app open):
- Today's habits: list with checkbox or value input per habit
- Quick note field for the day
- Upcoming deadlines in the next 7 days
- Linkage chain: shows which goals each habit feeds into (e.g., "Exercise → Weight Loss → Healthy Lifestyle")

**Week View**:
- 7-column calendar grid
- Each day: habit completion checkmarks, goal deadlines highlighted
- Habit compliance bar or color per day (green = all done, yellow = partial, red = none)
- Tap any day → Day View

**Month View**:
- Full month calendar grid
- Heatmap overlay on habit compliance per day
- Goal due dates marked
- Tap any date → Day View

**Year View**:
- List of all goals grouped by status (in_progress, completed, paused, not_started)
- Optional: horizontal timeline mode showing goals by date range
- Summary stats: total goals, completed this year, behind schedule
- Tap any goal → Goal Detail screen

### 3.4 Notifications

All notifications are **local OS notifications** — no server required. They fire even when the app is closed, using the device's native alarm scheduler.

| Notification | Trigger | Delivery |
|---|---|---|
| Habit reminder | Daily/weekly at user-set time | Push (OS alarm) |
| Goal deadline warning | 7, 3, 1, 0 days before due date | Push (OS alarm) |
| Weekly progress check-in | Every Monday evening | Push (OS alarm) |
| Streak break | When user misses next day | Push (OS alarm) |
| Milestone reached | When KPI log hits milestone value | In-app toast |
| Goal completed | When status set to "completed" | In-app toast |

On every app boot (and nightly at 11 PM), the app reschedules all pending notifications by querying active habits and goals.

User-configurable:
- Global habit reminder time (default: 9:00 AM)
- Per-habit override reminder time
- Quiet hours (default: 11 PM – 8 AM)
- Toggle per notification type

### 3.5 KPI Analytics (On-Demand)

Accessible from Goal Detail and Habit Detail screens. No AI — simple computed metrics.

- Time interval selector: daily / weekly / monthly view
- Line chart: actual value over time
- Milestone markers on chart (expected vs. actual at each checkpoint)
- KPI adjustment markers on chart (shows when target was changed)
- Summary stats: current value, % toward target, trend (up/flat/down), avg, min, max over period
- Export chart data as CSV

### 3.6 Backup & Restore

**Export**:
- Settings → "Export Backup"
- Exports all data as a `.json` file
- Saved to device Documents/Downloads
- User can share via email, cloud, etc.

**Import**:
- Settings → "Import Backup"
- User picks a `.json` file from device
- App shows a preview: how many goals, habits, logs will be imported
- Conflict detection: if an entity exists in both local DB and backup, show resolution UI
- Resolution options per conflict: Keep local / Use imported / Create as copy "(imported)"
- Import is atomic (all or nothing — rolls back on failure)
- Full audit log of import events

**Backup format** (`.json`):
```json
{
  "version": 1,
  "exportedAt": "ISO timestamp",
  "userId": "self",
  "data": {
    "goals": [...],
    "habits": [...],
    "kpis": [...],
    "kpiLogs": [...],
    "habitKpis": [...],
    "habitKpiLogs": [...],
    "links": [...],
    "milestones": [...],
    "notes": [...]
  }
}
```

---

## 4. Screen Inventory & Navigation

### 4.1 Navigation Structure

```
Root: BottomTabNavigator
├─ Tab 1: Day     → DayScreen
├─ Tab 2: Week    → WeekScreen
├─ Tab 3: Month   → MonthScreen
└─ Tab 4: Goals   → YearScreen (all goals)

Stack modals (navigate from any tab):
├─ GoalDetailScreen        (goal detail, KPIs, tree, habits)
├─ CreateEditGoalScreen    (create or edit goal)
├─ HabitDetailScreen       (habit detail, logs, streak)
├─ CreateEditHabitScreen   (create or edit habit)
├─ KPIAnalyticsScreen      (chart + stats for a KPI)
└─ SettingsScreen          (theme, notifications, backup)
```

### 4.2 Screen Descriptions

**DayScreen**
- Header: today's date, greeting
- Section: "Today's Habits" — list of active habits with check/log button
  - Tapping a habit shows inline input (binary toggle or value + unit)
  - Optional note per habit log
- Section: "Upcoming Deadlines" — goals due in next 7 days
- Section: "Goal Chain" — visual linkage (tap any habit to see chain: habit → goal → parent goal)
- FAB: Create new goal or habit

**WeekScreen**
- Header: week range (e.g., "Dec 16 – Dec 22")
- 7-column grid with day labels
- Each cell: habit compliance color + count, goal deadline badge
- Tap cell → DayScreen for that date
- Summary row: weekly habit compliance %

**MonthScreen**
- Full calendar grid (5-6 rows × 7 columns)
- Each cell: heatmap dot (green/yellow/red based on habit compliance)
- Goal due dates: highlighted with a badge
- Tap cell → DayScreen for that date
- Month navigation arrows

**YearScreen (Goals)**
- Filter tabs: All / Active / Completed / Paused
- Goal cards (title, due date, progress %, tags)
- Toggle: List view / Timeline view (horizontal by date)
- Tap goal card → GoalDetailScreen
- FAB: Create new goal

**GoalDetailScreen**
- Header: title, status badge, date range
- KPI section: each KPI shows current value, progress bar, mini chart
  - Tap KPI → KPIAnalyticsScreen
  - "+ Log value" button
- Sub-goals tree: collapsible, each node shows title + status
  - Tap node → GoalDetailScreen for sub-goal
  - "+ Add sub-goal" button
- Supporting habits section: linked habits with today's status + importance badge
  - Tap habit → HabitDetailScreen
  - "+ Link habit" button
- Notes section: chronological list of qualitative notes
  - "+ Add note" button
- Actions: Edit goal, Change status, Delete goal

**CreateEditGoalScreen**
- Title (required), description (optional)
- Start date, due date (both required)
- Goal type: Outcome or Target
- If Target: add KPIs inline (name, unit, start value, target value)
- Tags (multi-select + custom)
- Parent goal (optional dropdown)
- Linked habits (optional, can link later)
- Save / Cancel

**HabitDetailScreen**
- Header: title, frequency badge, streak counter (e.g., "🔥 Day 14")
- KPI logs table: date, value/completed, note (sortable)
- Chart: KPI trend over last 30 days (toggle: 7d / 30d / 90d / all)
- Streak history: current streak, all-time best, restart count
- Linked goals: which goals this habit supports, with importance
- Actions: Log today, Edit habit, Pause habit, Restart streak

**CreateEditHabitScreen**
- Title (required), description (optional)
- Frequency: Daily / Weekly (day picker) / Custom (cron input)
- Reminder time: toggle + time picker (optional)
- KPI definition: binary or measured (name, unit, target)
- Tags (multi-select + custom)
- Linked goals (multi-select + importance per link)
- Start date, optional end date
- Save / Cancel

**KPIAnalyticsScreen**
- KPI name + unit header
- Interval toggle: Daily / Weekly / Monthly
- Line chart: actual values + milestone markers + adjustment markers
- Stats panel: current, target, % progress, avg, min, max, trend arrow
- KPI adjustment history: table of (date, old target, new target, reason)
- Export as CSV button

**SettingsScreen**
- Theme: Light / Dark / System
- Default view on open: Day / Week / Month / Year
- Notifications:
  - Toggle: push enabled
  - Toggle: in-app alerts enabled
  - Global habit reminder time
  - Quiet hours (start, end)
  - Per-type toggles
- Backup & Restore:
  - Export Backup (button)
  - Import Backup (button)
  - Last backup date
- About: version, data info

---

## 5. Data Model (Conceptual)

### Entities

```
User
  └─ one-to-one: UserSettings

Goal
  ├─ self-referential: parentGoalId (unlimited depth tree)
  ├─ one-to-many: KPI
  │   ├─ one-to-many: KPILog
  │   ├─ one-to-many: KPIAdjustment
  │   └─ one-to-many: Milestone
  ├─ one-to-many: GoalNote
  └─ many-to-many: Habit (via GoalHabitLink)

Habit
  ├─ one-to-many: HabitKPI
  │   ├─ one-to-many: HabitKPILog
  │   └─ one-to-one: HabitStreak
  └─ many-to-many: Goal (via GoalHabitLink)

GoalHabitLink
  ├─ belongs-to: Goal
  ├─ belongs-to: Habit
  └─ field: importance (critical / important / supporting)

Notification
  ├─ optional belongs-to: Goal
  └─ optional belongs-to: Habit
```

### Key Fields

**Goal**: id, userId, title, description, parentGoalId, startDate, dueDate, status, tags (JSON array)

**KPI**: id, goalId, name, unit, startValue, targetValue, currentValue

**KPILog**: id, kpiId, logDate, value, note

**KPIAdjustment**: id, kpiId, previousTargetValue, newTargetValue, reason, adjustedAt

**Milestone**: id, kpiId, targetDate, expectedValue, description

**Habit**: id, userId, title, description, frequency, daysOfWeek (JSON), customSchedule, startDate, targetEndDate, status, reminderTime, tags (JSON array)

**HabitKPI**: id, habitId, name, unit, trackingType (binary/measured), targetValue, targetUnit

**HabitKPILog**: id, habitKpiId, logDate, value (numeric, nullable), completed (boolean, nullable), note, streakActive

**HabitStreak**: id, habitKpiId, currentStreakStart, streakLength, longestStreakLength, timesRestarted

**GoalHabitLink**: id, goalId, habitId, importance, estimatedImpact

---

## 6. UX Principles

### 6.1 Research-Backed Design

**Goal-Setting Theory (Locke & Latham, 35+ years)**
- Specific + measurable goals outperform vague ones → enforce KPIs
- Challenging but achievable goals → milestones help validate realism
- Feedback loops improve performance → KPI charts + progress bars

**Habit Formation (BJ Fogg, Duhigg)**
- Cue → Routine → Reward: notifications (cue) + daily logging (routine) + streak counter (reward)
- Habit stacking: linking habit to goal creates context and meaning
- Small wins compound: streak counter + progress bars reinforce momentum

**Temporal Psychology (Kahneman)**
- Year/Month/Week/Day zoom mirrors natural planning horizons
- Intermediate milestones reduce overwhelm on long-horizon goals
- Progress visualization combats "future discounting" (tendency to undervalue distant goals)

**Behavioral Economics**
- Loss aversion: streak breaks are visible but resettable (painful enough to motivate, not enough to demotivate)
- Commitment: qualitative notes + edit history = accountability
- Concrete planning: forcing habit-goal linkage makes goals feel actionable

### 6.2 UX Heuristics Applied

- **Minimal friction for daily tasks**: Logging a habit is 1-2 taps from DayScreen. Common action = shortest path.
- **Progressive disclosure**: Simple on entry (just title + dates), advanced features revealed on detail screens (KPIs, milestones, analytics).
- **No guilt design**: Streak breaks show history but don't block or shame. "Restart" is always available.
- **Top-down mental model**: Users start with the big goal and drill down, not the other way around.
- **Clarity over density**: Calendar views use color and small indicators, not text-heavy cells.
- **Consistent actions**: FAB for creating, swipe-left for quick actions, tap-to-open for detail views — consistent throughout.

### 6.3 Information Architecture (Priority Order per Screen)

Each screen has one primary job:
- **DayScreen**: Log today's habits. Everything else is secondary.
- **WeekScreen**: See the week's pattern. Navigate to a specific day.
- **MonthScreen**: See trends and deadlines. Navigate to a specific day.
- **YearScreen**: Manage goals. Navigate to goal detail.
- **GoalDetailScreen**: Understand progress. Take action on KPIs and sub-goals.
- **HabitDetailScreen**: Review consistency. Log if not done today.

---

## 7. Color Palette Suggestions

### 7.1 Design System Philosophy

The palette should:
- Feel focused and intentional (not playful/gamified)
- Work in both light and dark mode without redesign
- Use color semantically (status, progress, category) — not decoratively
- Support accessibility (WCAG AA contrast minimum)
- Be easily swappable via design tokens (no hardcoded hex in components)

### 7.2 Primary Palette: "Focus" (Recommended)

A slate-and-indigo palette. Calming, serious, productive.

```
Primary:     #5B6AF0  (Indigo — actions, links, progress)
Background:  #FFFFFF / #0F1117 (light/dark)
Surface:     #F7F8FC / #1A1D27
Border:      #E2E5F0 / #2A2D3E
TextPrimary: #111827 / #F1F3F9
TextSec:     #6B7280 / #9CA3AF

Semantic:
  Success:   #22C55E  (goal completed, streak active)
  Warning:   #F59E0B  (behind schedule, approaching deadline)
  Danger:    #EF4444  (streak broken, overdue)
  Info:      #3B82F6  (neutral info, notes)

Tag Colors (goal categories):
  Health:    #10B981  (green)
  Finance:   #6366F1  (indigo)
  Career:    #F59E0B  (amber)
  Personal:  #EC4899  (pink)
  Learning:  #8B5CF6  (violet)
  Social:    #14B8A6  (teal)
```

### 7.3 Alternate Palette: "Warm" (Alternative Option)

A warmer, amber-and-earth tone for a more personal/journal-like feel.

```
Primary:     #D97706  (Amber)
Background:  #FFFBF5 / #1C1611
Surface:     #FEF3E2 / #2A2018
Border:      #FDE68A / #3D3020
TextPrimary: #1C1611 / #FEF3E2
TextSec:     #78716C / #A8A09A

Semantic:
  Success:   #16A34A
  Warning:   #F97316
  Danger:    #DC2626
  Info:      #0284C7
```

### 7.4 Usage Rules

1. **Primary color** only for: CTAs (buttons, FABs), progress fills, active tab indicator, links
2. **Semantic colors** only for: status badges, streak indicators, deadline warnings — never for decoration
3. **Surface color** for cards, modals, bottom sheets — slightly elevated from background
4. **Border color** for dividers, card outlines, input fields — should be subtle
5. **Tag colors** for goal/habit category tags — distinct but not loud
6. **Never use more than 2 non-semantic colors on one screen**

---

## 8. Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Goals vs. Habits | Separate entities, linked via junction | Conceptually distinct; one habit can support many goals |
| Goal depth | Unlimited tree | No artificial limit; tree structure via parentGoalId |
| KPI change policy | Allowed, with audit trail | Goals evolve; changes should be traceable |
| Milestone calculation | Manual only | Auto-calculation requires AI; not in scope |
| Habit tracking type | Binary or measured, per habit | Different habits need different granularity |
| Notifications | Local OS, no server | Privacy-first; works offline; no backend cost |
| Habit reminder | Optional time (reminder ≠ deadline) | Execution flexibility; not a scheduling app |
| Export format | Plain .json | Portable, debuggable; encryption optional later |
| Import conflicts | Show UI, user decides per conflict | Safe; avoids silent data loss |
| Multi-year goals | Supported by default | No date limits in schema |
| Collaboration | Architecture-ready (userId on all entities) | Not in MVP; single-user default ("self") |
| Theme | Light / Dark / System | Required for daily-use app |
