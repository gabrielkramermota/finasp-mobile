import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { formatCurrencyBRL, getDateForMonthKeyDay } from '../../utils/formatters';

const paymentReminderChannelId = 'person-payment-reminders';
const paymentReminderSound = 'notification.mp3';
let notificationsConfigured = false;

type SchedulePersonPaymentReminderInput = {
  amount: number;
  competenceMonth: string;
  description?: string;
  dueDay: number;
  personName: string;
};

export type PersonPaymentReminderStatus =
  | 'scheduled'
  | 'permission-denied'
  | 'date-in-past'
  | 'failed';

type PersonPaymentReminderResult = {
  notificationId: string | null;
  status: PersonPaymentReminderStatus;
};

export async function configureLocalNotifications() {
  if (!notificationsConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    notificationsConfigured = true;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(paymentReminderChannelId, {
      name: 'Pagamentos do mes',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#2563eb',
      sound: paymentReminderSound,
      vibrationPattern: [0, 180, 120, 180],
    });
  }
}

async function ensureNotificationPermission() {
  const currentPermissions = await Notifications.getPermissionsAsync();

  if (currentPermissions.status === 'granted') {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();

  return requestedPermissions.status === 'granted';
}

export async function schedulePersonPaymentReminder({
  amount,
  competenceMonth,
  description,
  dueDay,
  personName,
}: SchedulePersonPaymentReminderInput): Promise<PersonPaymentReminderResult> {
  await configureLocalNotifications();

  const reminderDate = getDateForMonthKeyDay(competenceMonth, dueDay);

  if (reminderDate.getTime() <= Date.now()) {
    return {
      notificationId: null,
      status: 'date-in-past',
    };
  }

  const hasPermission = await ensureNotificationPermission();

  if (!hasPermission) {
    return {
      notificationId: null,
      status: 'permission-denied',
    };
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pagamento pendente',
        body: description?.trim()
          ? `Hoje e dia de pagar ${personName}: ${description.trim()} (${formatCurrencyBRL(amount)}).`
          : `Hoje e dia de pagar ${personName} (${formatCurrencyBRL(amount)}).`,
        sound: paymentReminderSound,
        data: {
          amount,
          competenceMonth,
          dueDay,
          kind: 'person-payment',
          personName,
        },
      },
      trigger: {
        channelId: paymentReminderChannelId,
        date: reminderDate,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    return {
      notificationId,
      status: 'scheduled',
    };
  } catch {
    return {
      notificationId: null,
      status: 'failed',
    };
  }
}

export async function cancelPersonPaymentReminder(notificationId?: string | null) {
  if (!notificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Cancelamento em modo best-effort.
  }
}
