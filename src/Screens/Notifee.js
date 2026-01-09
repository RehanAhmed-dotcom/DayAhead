import notifee, {
  TriggerType,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import { navigate } from './RootNavigation';

const extractAlarmPayload = detail => {
  const raw = detail?.notification?.data?.alarm;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.log('alarm payload parse error', error);
    }
  }
  return null;
};

const goToAlarmScreen = detail => {
  const payload = extractAlarmPayload(detail);
  if (payload) {
    navigate('AlarmScreen', { alarm: payload });
  } else {
    navigate('AlarmScreen');
  }
};

export async function setupNotificationListeners() {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (
      type === EventType.DELIVERED ||
      type === EventType.PRESS ||
      type === EventType.ACTION_PRESS
    ) {
      goToAlarmScreen(detail);
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (
      type === EventType.DELIVERED ||
      type === EventType.PRESS ||
      type === EventType.ACTION_PRESS
    ) {
      goToAlarmScreen(detail);
    }
  });
}
export async function setup() {
  // Request permission (iOS)
  await notifee.requestPermission();

  // Create a channel (Android)
  await notifee.createChannel({
    id: 'alarm2', // <-- NEW ID
    name: 'Alarm Channel 2',
    sound: 'alarm',
    importance: AndroidImportance.HIGH,
  });
}

// -----------------------------
// Schedule an alarm notification
// -----------------------------
export async function scheduleAlarm(date) {
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    alarmManager: true, // Android: allows wake-up
  };

  await notifee.createTriggerNotification(
    {
      title: '⏰ Alarm',
      body: 'Your alarm is ringing!',
      android: {
        actions: [
          {
            title: 'Snooze',
            pressAction: { id: 'snooze' },
          },
          {
            title: 'Stop',
            pressAction: { id: 'stop' },
          },
        ],
        channelId: 'alarm2',
        importance: AndroidImportance.HIGH,
        sound: 'alarm',
        vibrationPattern: [300, 500],
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
      },
    },
    trigger,
  );
}

// -----------------------------
// Alarm helpers for Snap Alarm
// -----------------------------

const dayMap = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function to24Hour(timeStr = '') {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if (!match) {
    return null;
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : '';

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

export function getNextTriggerDate(timeStr, repeatDays = []) {
  if (!timeStr) {
    return null;
  }

  const parsed = to24Hour(timeStr);
  if (!parsed) {
    return null;
  }

  const now = new Date();
  const today = now.getDay();

  const candidates = repeatDays.length ? repeatDays : [''];

  const upcoming = candidates
    .map(day => {
      const key = day.trim().toLowerCase().slice(0, 3);
      const targetDay = dayMap[key];

      let candidate = new Date(now);
      if (targetDay === undefined) {
        // One-time alarm → use today/tomorrow logic
        candidate.setHours(parsed.hours, parsed.minutes, 0, 0);
        if (candidate <= now) {
          candidate.setDate(candidate.getDate() + 1);
        }
        return candidate;
      }

      const daysAhead = (targetDay - today + 7) % 7;
      candidate.setDate(now.getDate() + daysAhead);
      candidate.setHours(parsed.hours, parsed.minutes, 0, 0);

      if (daysAhead === 0 && candidate <= now) {
        candidate.setDate(candidate.getDate() + 7);
      }
      return candidate;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  return upcoming[0] || null;
}

export async function scheduleAlarmForItem(alarm) {
  if (!alarm) {
    return null;
  }

  const triggerDate = getNextTriggerDate(alarm.time, alarm.repeat);
  if (!triggerDate) {
    return null;
  }

  const notificationId = String(alarm.id);

  await notifee.cancelNotification(notificationId);

  const payload = {
    id: alarm.id,
    title: alarm.title,
    time: alarm.time,
    repeat: alarm.repeat,
    status: alarm.status,
  };

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: `⏰ ${alarm.title || 'Alarm'}`,
      body:
        alarm.repeat && alarm.repeat.length
          ? `Repeats on ${alarm.repeat.join(', ')}`
          : 'One-time alarm',
      data: {
        type: 'snapAlarm',
        alarm: JSON.stringify(payload),
      },
      android: {
        channelId: 'alarm2',
        importance: AndroidImportance.HIGH,
        sound: 'alarm',
        vibrationPattern: [300, 500],
        pressAction: { id: 'default' },
        actions: [
          { title: 'Snooze', pressAction: { id: 'snooze' } },
          { title: 'Stop', pressAction: { id: 'stop' } },
        ],
      },
      ios: {
        sound: 'default',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      alarmManager: true,
    },
  );

  return triggerDate;
}

export async function cancelAlarmById(alarmId) {
  if (!alarmId) {
    return;
  }
  await notifee.cancelNotification(String(alarmId));
}
