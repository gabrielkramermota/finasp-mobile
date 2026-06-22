# Settings Layout Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the settings screen into a cleaner control panel with a stronger profile header, compact icon-led sections, and a separated destructive action area.

**Architecture:** Keep existing settings logic in `SettingsPage` and reuse the current settings components, but restyle their structure into compact action sections. Use `lucide-react-native` icons already installed for visual scanning.

**Tech Stack:** Expo React Native, TypeScript, NativeWind/react-native-css, lucide-react-native.

---

### Task 1: Settings Layout Components

**Files:**

- Modify: `src/app/settings/SettingsPage.tsx`
- Modify: `src/components/settings/ProfileSettingsSection.tsx`
- Modify: `src/components/settings/BackupSettingsSection.tsx`
- Modify: `src/components/settings/DatabaseResetSection.tsx`
- Modify: `src/components/settings/AppInfoSection.tsx`
- Modify: `src/components/settings/SettingsCountsSection.tsx`

- [ ] Create a stronger profile summary header in `SettingsPage`.
- [ ] Convert settings sections into compact icon-led cards.
- [ ] Keep reset as a separated danger section at the bottom.

### Task 2: Verification

**Files:**

- Project-wide verification.

- [ ] Run `npx.cmd tsc --noEmit`.
- [ ] Run `npm.cmd run lint`.
