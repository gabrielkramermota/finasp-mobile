import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardPage } from '../../app/dashboard/DashboardPage';
import { EntriesPage } from '../../app/entries/EntriesPage';
import { RecurringEntriesPage } from '../../app/recurring-entries/RecurringEntriesPage';
import { SettingsPage } from '../../app/settings/SettingsPage';
import { OnboardingPage } from '../../app/welcome/OnboardingPage';
import { BootSplash } from '../../components/branding/BootSplash';
import { Text, View } from '../../components/ui/NativePrimitives';
import type { MonthKey } from '../../domain/finance/finance-types';
import { useUserProfile } from '../../service/user/user-repository';
import { appColors } from '../../theme/app-colors';
import { getMonthKey } from '../../utils/formatters';
import { BottomTabBar } from './BottomTabBar';
import type { AppTabKey } from './app-tabs';

function LoadingState() {
  return (
    <BootSplash
      message="Verificando se ja existe um perfil local neste aparelho."
      title="Preparando seu acesso"
    />
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="text-expense text-[11px] font-semibold tracking-[1.6px] uppercase">
        Perfil indisponivel
      </Text>
      <Text className="text-content-primary mt-4 max-w-sm text-center text-lg font-bold">
        Nao foi possivel carregar seu acesso local.
      </Text>
      <Text className="text-content-muted mt-3 max-w-sm text-center text-sm leading-6">
        {message}
      </Text>
    </View>
  );
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<AppTabKey>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(() => getMonthKey());
  const { error, isLoading, profile } = useUserProfile();

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
        <ErrorState message={error.message} />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
        <View className="bg-background flex-1">
          <OnboardingPage />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
      <View className="bg-background flex-1">
        <View className="flex-1">
          {activeTab === 'dashboard' ? (
            <DashboardPage selectedMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
          ) : null}
          {activeTab === 'entries' ? <EntriesPage selectedMonth={selectedMonth} /> : null}
          {activeTab === 'recurring' ? (
            <RecurringEntriesPage selectedMonth={selectedMonth} />
          ) : null}
          {activeTab === 'settings' ? <SettingsPage /> : null}
        </View>

        <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
