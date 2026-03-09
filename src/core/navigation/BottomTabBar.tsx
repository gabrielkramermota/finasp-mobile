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

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            className={cn('flex-1 rounded-[14px] px-3 py-3', isActive && 'bg-background')}
            onPress={() => onChangeTab(tab.key)}>
            <View className="items-center">
              <View
                className={cn(
                  'mb-2 h-[3px] w-8 rounded-full',
                  isActive ? 'bg-brand' : 'bg-surface-strong'
                )}
              />
              <Text
                className={cn(
                  'text-[10px] font-bold tracking-[1.4px] uppercase',
                  isActive ? 'text-brand-200' : 'text-content-subtle'
                )}>
                {tab.shortLabel}
              </Text>
              <Text
                className={cn(
                  'mt-1 text-sm font-semibold',
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
