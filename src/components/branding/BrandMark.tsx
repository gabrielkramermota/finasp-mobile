import React from 'react';

import { cn } from '../../utils/cn';
import { Image, View } from '../ui/NativePrimitives';

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  source?: 'logo' | 'splash';
};

const brandMarkSources = {
  logo: require('../../../assets/logo2.png'),
  splash: require('../../../assets/splash.png'),
} as const;

export function BrandMark({ className, imageClassName, source = 'logo' }: BrandMarkProps) {
  return (
    <View className={cn('self-start', className)}>
      <Image
        accessibilityLabel="Logo Finasp"
        className={cn('h-28 w-36 rounded-[18px]', imageClassName)}
        resizeMode="contain"
        source={brandMarkSources[source]}
      />
    </View>
  );
}
