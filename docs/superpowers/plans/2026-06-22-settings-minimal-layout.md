# Settings Minimal Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the settings screen more minimal by removing large informational cards and keeping only compact, useful controls.

**Architecture:** Keep all settings behavior intact and reduce the visual weight of `SettingsPage`, `SettingsCountsSection`, and `AppInfoSection`. The app information becomes a small footer instead of a full card.

**Tech Stack:** Expo React Native, TypeScript, NativeWind/react-native-css, lucide-react-native.

---

### Task 1: Minimal Settings Layout

**Files:**

- Modify: `src/app/settings/SettingsPage.tsx`
- Modify: `src/components/settings/AppInfoSection.tsx`
- Modify: `src/components/settings/SettingsCountsSection.tsx`

- [ ] Remove the large status/details area from the settings header.
- [ ] Move app version/status into a small footer line.
- [ ] Keep profile, saved data, backup, and reset available as compact sections.

### Task 2: Verification

**Files:**

- Project-wide verification.

- [ ] Run `npx.cmd tsc --noEmit`.
- [ ] Run `npm.cmd run lint`.
