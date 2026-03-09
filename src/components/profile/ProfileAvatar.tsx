import React from 'react';

import { cn } from '../../utils/cn';
import { Image, Text, View } from '../ui/NativePrimitives';

type ProfileAvatarProps = {
  name: string;
  photoUri?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const avatarSizes = {
  sm: 'h-14 w-14 rounded-[12px]',
  md: 'h-20 w-20 rounded-[16px]',
  lg: 'h-24 w-24 rounded-[18px]',
} as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) {
    return 'F';
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function ProfileAvatar({ name, photoUri, className, size = 'md' }: ProfileAvatarProps) {
  const sizeClassName = avatarSizes[size];

  if (photoUri) {
    return (
      <Image
        accessibilityLabel={`Foto de perfil de ${name}`}
        className={cn(sizeClassName, className)}
        resizeMode="cover"
        source={{ uri: photoUri }}
      />
    );
  }

  return (
    <View
      className={cn(
        'bg-brand-soft items-center justify-center border border-white/10',
        sizeClassName,
        className
      )}>
      <Text className="text-brand-200 text-lg font-black tracking-tight">{getInitials(name)}</Text>
    </View>
  );
}
