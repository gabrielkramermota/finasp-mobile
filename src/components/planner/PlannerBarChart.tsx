import React from 'react';

import { Text, View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';

type PlannerBarChartItem = {
  colorClassName: string;
  label: string;
  percentageLabel: string;
  value: string;
  widthPercentage: number;
};

type PlannerBarChartProps = {
  items: PlannerBarChartItem[];
};

export function PlannerBarChart({ items }: PlannerBarChartProps) {
  return (
    <View className="gap-3">
      {items.map((item) => (
        <View key={item.label} className="gap-2">
          <View className="flex-row items-end justify-between gap-3">
            <View className="flex-1">
              <Text className="text-content-primary text-sm font-semibold">{item.label}</Text>
              <Text className="text-content-muted mt-1 text-xs">{item.value}</Text>
            </View>
            <Text className="text-content-secondary text-xs font-semibold">
              {item.percentageLabel}
            </Text>
          </View>

          <View className="bg-background h-2.5 overflow-hidden rounded-full">
            <View
              className={cn('h-full rounded-full', item.colorClassName)}
              style={{ width: `${Math.max(0, Math.min(item.widthPercentage, 100))}%` }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
