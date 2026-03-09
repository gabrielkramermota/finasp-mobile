import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from './AppProviders';
import { AppShell } from './navigation/AppShell';

export function AppRoot() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <AppShell />
    </AppProviders>
  );
}
