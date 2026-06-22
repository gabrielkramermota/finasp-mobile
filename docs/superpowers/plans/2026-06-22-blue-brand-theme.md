# Blue Brand Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the app brand color a professional blue through global theme variables.

**Architecture:** Update CSS theme variables in `global.css` and the runtime color object in `app-colors.ts` to the same blue palette. Replace remaining hard-coded teal values in components with the blue brand values.

**Tech Stack:** Expo React Native, TypeScript, NativeWind/react-native-css.

---

### Task 1: Theme Tokens

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/theme/app-colors.ts`

- [ ] Set `brand` to `#2563EB`.
- [ ] Set `brand200` to `#93C5FD`.
- [ ] Set `brand300` to `#60A5FA`.
- [ ] Set `brandSoft` to `rgba(37, 99, 235, 0.14)`.

### Task 2: Hard-Coded Brand Colors

**Files:**

- Modify files returned by `rg "#2dd4bf|#5eead4|#99f6e4|rgba\\(45, 212, 191" src`

- [ ] Replace teal icon/loading/notification values with blue equivalents.
- [ ] Keep income green and expense red unchanged.

### Task 3: Verification

**Files:**

- Project-wide verification.

- [ ] Run `npx.cmd tsc --noEmit`.
- [ ] Run `npm.cmd run lint`.
