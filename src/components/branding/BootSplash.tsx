import React from 'react';

import { ActivityIndicator, Text, View } from '../ui/NativePrimitives';
import { BrandMark } from './BrandMark';

type BootSplashProps = {
  message: string;
  title: string;
};

export function BootSplash({ message, title }: BootSplashProps) {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <View className="items-center">
        <BrandMark className="self-center" imageClassName="h-28 w-44 rounded-[24px]" />
        <Text className="text-brand-200 mt-6 text-[11px] font-semibold tracking-[1.6px] uppercase">
          Finasp
        </Text>
        <Text className="text-content-primary mt-3 text-center text-[28px] font-black tracking-tight">
          {title}
        </Text>
        <Text className="text-content-muted mt-3 max-w-[280px] text-center text-sm leading-6">
          {message}
        </Text>
      </View>

      <View className="mt-8 items-center">
        <ActivityIndicator color="#2563eb" size="large" />
      </View>
    </View>
  );
}
