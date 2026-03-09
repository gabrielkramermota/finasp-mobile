import React from 'react';

import { cn } from '../../utils/cn';
import { Image, View } from '../ui/NativePrimitives';

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
};

export function BrandMark({ className, imageClassName }: BrandMarkProps) {
  return (
    <View className={cn('self-start', className)}>
      <Image
        accessibilityLabel="Logo Finasp"
        className={cn('h-28 w-36 rounded-[18px]', imageClassName)}
        resizeMode="contain"
        source={require('../../../assets/logo.png')}
      />
    </View>
  );
}
