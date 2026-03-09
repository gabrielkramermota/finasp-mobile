import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '../components/ui/ToastProvider';
import { configureLocalNotifications } from '../service/notifications/payment-reminders';
import { FinanceDatabaseProvider } from './FinanceDatabaseProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    void configureLocalNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <FinanceDatabaseProvider>{children}</FinanceDatabaseProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
