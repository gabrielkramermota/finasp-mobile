# Nav Icons And Summary List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add icons to the bottom navigation and make dashboard summary cards stack vertically instead of rendering as a wrapped grid.

**Architecture:** Use `lucide-react-native` icons inside the existing `BottomTabBar`, keeping tab metadata centralized in `app-tabs.ts`. Keep summary data unchanged and adjust only layout classes and the `SummaryMetricCard` component structure for full-width, scan-friendly rows.

**Tech Stack:** Expo React Native, TypeScript, NativeWind/react-native-css, lucide-react-native, react-native-svg.

---

### Task 1: Icon Dependency

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Install `lucide-react-native`.
- [ ] Install Expo-compatible `react-native-svg`.

### Task 2: Bottom Navigation

**Files:**

- Modify: `src/core/navigation/app-tabs.ts`
- Modify: `src/core/navigation/BottomTabBar.tsx`

- [ ] Add an icon component to each tab entry.
- [ ] Render icon above the tab label.
- [ ] Keep active state color and background readable.

### Task 3: Summary Cards

**Files:**

- Modify: `src/components/planner/SummaryMetricCard.tsx`
- Modify: `src/app/dashboard/DashboardPage.tsx`

- [ ] Convert summary card container from wrapped row to vertical column.
- [ ] Make each card full width.
- [ ] Arrange title/description and value as a horizontal row when space allows.

### Task 4: Verification

**Files:**

- Project-wide verification.

- [ ] Run `npx.cmd tsc --noEmit`.
- [ ] Run `npm.cmd run lint`.
- [ ] Restart Expo with `npm.cmd start -- --host localhost`.
