import React from 'react';

import { cn } from '../../utils/cn';
import { Pressable, Text, View } from '../../components/ui/NativePrimitives';
import type { AppTabKey } from './app-tabs';
import { appTabs } from './app-tabs';

type BottomTabBarProps = {
  activeTab: AppTabKey;
  onChangeTab: (tab: AppTabKey) => void;
};

export function BottomTabBar({ activeTab, onChangeTab }: BottomTabBarProps) {
  return (
    <View className="border-border-subtle bg-surface mx-4 mb-4 flex-row rounded-[20px] border px-2 py-2">
      {appTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const iconColor = isActive ? '#60a5fa' : '#8a98a8';
        const Icon = tab.Icon;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            className={cn('flex-1 rounded-[14px] px-2 py-3', isActive && 'bg-background')}
            onPress={() => onChangeTab(tab.key)}>
            <View className="min-h-[54px] items-center justify-center gap-1">
              <Icon color={iconColor} size={22} strokeWidth={isActive ? 2.6 : 2.2} />
              <Text
                className={cn(
                  'text-center text-[11px] font-bold',
                  isActive ? 'text-content-primary' : 'text-content-muted'
                )}>
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
