import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '../../utils/cn';
import { Text, View } from './NativePrimitives';

type ToastTone = 'info' | 'success' | 'error';

type ToastOptions = {
  duration?: number;
  message: string;
  playSound?: boolean;
  tone?: ToastTone;
};

type ToastState = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const toastCopy: Record<
  ToastTone,
  {
    accentClassName: string;
    label: string;
    labelClassName: string;
  }
> = {
  info: {
    accentClassName: 'bg-brand',
    label: 'Aviso',
    labelClassName: 'text-brand-200',
  },
  success: {
    accentClassName: 'bg-income',
    label: 'Sucesso',
    labelClassName: 'text-income',
  },
  error: {
    accentClassName: 'bg-expense',
    label: 'Erro',
    labelClassName: 'text-expense',
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const insets = useSafeAreaInsets();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastPlayer = useAudioPlayer(require('../../../assets/toast.mp3'));
  const errorToastPlayer = useAudioPlayer(require('../../../assets/toast-error.mp3'));

  const playToastSound = useCallback(
    async (tone: ToastTone) => {
      try {
        const player = tone === 'error' ? errorToastPlayer : toastPlayer;

        if (!player.isLoaded) {
          return;
        }

        await player.seekTo(0);
        player.play();
      } catch {
        // O som do toast e um reforco visual; falha silenciosa evita bloquear o fluxo.
      }
    },
    [errorToastPlayer, toastPlayer]
  );

  useEffect(() => {
    toastPlayer.loop = false;
    toastPlayer.volume = 0.55;
    errorToastPlayer.loop = false;
    errorToastPlayer.volume = 0.65;
  }, [errorToastPlayer, toastPlayer]);

  const clearToastTimeout = useCallback(() => {
    if (!timeoutRef.current) {
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const showToast = useCallback(
    ({ duration = 3200, message, playSound = false, tone = 'info' }: ToastOptions) => {
      clearToastTimeout();
      setToast({
        id: Date.now(),
        message,
        tone,
      });

      if (playSound || tone === 'error') {
        void playToastSound(tone);
      }

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, duration);
    },
    [clearToastTimeout, playToastSound]
  );

  useEffect(() => clearToastTimeout, [clearToastTimeout]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);
  const toastTone = toast ? toastCopy[toast.tone] : null;

  return (
    <ToastContext.Provider value={contextValue}>
      <View className="flex-1">
        {children}

        {toast && toastTone ? (
          <View
            pointerEvents="none"
            style={{
              left: 16,
              position: 'absolute',
              right: 16,
              top: insets.top + 12,
            }}>
            <View
              key={toast.id}
              className="border-border-subtle bg-surface flex-row items-start gap-3 rounded-[18px] border px-4 py-4">
              <View className={cn('mt-1 h-2.5 w-2.5 rounded-full', toastTone.accentClassName)} />
              <View className="flex-1">
                <Text
                  className={cn(
                    'text-[11px] font-semibold tracking-[1.2px] uppercase',
                    toastTone.labelClassName
                  )}>
                  {toastTone.label}
                </Text>
                <Text className="text-content-secondary mt-2 text-sm leading-6">
                  {toast.message}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}
