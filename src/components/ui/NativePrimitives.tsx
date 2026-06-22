import React from 'react';
import type {
  ActivityIndicatorProps,
  ImageProps,
  ModalProps,
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import {
  ActivityIndicator as RNActivityIndicator,
  Image as RNImage,
  Modal as RNModal,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native';

// react-native@0.81 + React 19 + react-native-css preview currently expose
// JSX types that are stricter than what TypeScript accepts out of the box.
// Centralizing the cast keeps feature code clean until the upstream typing settles.
export const View = RNView as unknown as React.ComponentType<ViewProps>;
export const Text = RNText as unknown as React.ComponentType<TextProps>;
export const Image = RNImage as unknown as React.ComponentType<ImageProps>;
export const ScrollView = RNScrollView as unknown as React.ComponentType<ScrollViewProps>;
export const Pressable = RNPressable as unknown as React.ComponentType<PressableProps>;
export const TextInput = RNTextInput as unknown as React.ComponentType<TextInputProps>;
export const ActivityIndicator =
  RNActivityIndicator as unknown as React.ComponentType<ActivityIndicatorProps>;
export const Modal = RNModal as unknown as React.ComponentType<ModalProps>;
