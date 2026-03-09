import React from 'react';
import type { ReactNode } from 'react';

import { Text, View } from '../ui/NativePrimitives';

type PlannerSectionCardProps = {
  title: string;
  totalLabel?: string;
  totalValue?: string;
  headerAccessory?: ReactNode;
  children: ReactNode;
};

export function PlannerSectionCard({
  title,
  totalLabel,
  totalValue,
  headerAccessory,
  children,
}: PlannerSectionCardProps) {
  return (
    <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
      <View className="border-border-subtle gap-3 border-b pb-3">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="text-content-primary flex-1 text-lg font-black tracking-tight">
            {title}
          </Text>
          {totalLabel && totalValue ? (
            <View className="items-end">
              <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
                {totalLabel}
              </Text>
              <Text className="text-content-primary mt-1 text-base font-black tracking-tight">
                {totalValue}
              </Text>
            </View>
          ) : null}
        </View>

        {headerAccessory ? <View>{headerAccessory}</View> : null}
      </View>
      <View className="pt-2">{children}</View>
    </View>
  );
}
