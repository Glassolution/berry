import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type TimeOfDay = { hour: number; minute: number };

export const useMealNotifications = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [time, setTime] = useState<TimeOfDay>({ hour: 8, minute: 0 });
  const [title, setTitle] = useState<string>('Refeição');

  const KEY_ENABLED = 'nutra:mealNotif:enabled';
  const KEY_HOUR = 'nutra:mealNotif:hour';
  const KEY_MIN = 'nutra:mealNotif:minute';
  const KEY_TITLE = 'nutra:mealNotif:title';

  useEffect(() => {
    const init = async () => {
      const e = await AsyncStorage.getItem(KEY_ENABLED);
      const h = await AsyncStorage.getItem(KEY_HOUR);
      const m = await AsyncStorage.getItem(KEY_MIN);
      const t = await AsyncStorage.getItem(KEY_TITLE);
      setEnabled(e === '1');
      setTime({ hour: h ? parseInt(h, 10) : 8, minute: m ? parseInt(m, 10) : 0 });
      setTitle(t || 'Refeição');
      if (Platform.OS !== 'web') {
        await Notifications.requestPermissionsAsync();
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('meals', {
            name: 'Refeições',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
      }
    };
    init();
  }, []);

  const persist = async () => {
    await AsyncStorage.multiSet([
      [KEY_ENABLED, enabled ? '1' : '0'],
      [KEY_HOUR, String(time.hour)],
      [KEY_MIN, String(time.minute)],
      [KEY_TITLE, title],
    ]);
  };

  const scheduleDaily = async (id: number, t: TimeOfDay, customTitle: string) => {
    const details = {
      content: {
        title: customTitle,
        body: 'Hora da refeição',
      },
      trigger: {
        hour: t.hour,
        minute: t.minute,
        repeats: true,
        channelId: Platform.OS === 'android' ? 'meals' : undefined,
      } as Notifications.DailyTriggerInput,
    };
    if (Platform.OS === 'web') {
      return '';
    }
    await Notifications.cancelScheduledNotificationAsync(String(id));
    const nid = await Notifications.scheduleNotificationAsync({
      content: details.content,
      trigger: details.trigger,
    });
    return nid;
  };

  const cancelAll = async () => {
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const enable = async (v: boolean) => {
    setEnabled(v);
    await persist();
    if (!v) {
      await cancelAll();
    } else {
      await scheduleDaily(1001, time, title);
    }
  };

  const setReminder = async (t: TimeOfDay, customTitle: string) => {
    setTime(t);
    setTitle(customTitle);
    await persist();
    if (enabled) {
      await scheduleDaily(1001, t, customTitle);
    }
  };

  const scheduleOnce = async (date: Date, customTitle: string) => {
    if (Platform.OS === 'web') {
      return '';
    }
    const nid = await Notifications.scheduleNotificationAsync({
      content: {
        title: customTitle,
        body: 'Lembrete',
      },
      trigger: date,
    });
    return nid;
  };

  return {
    enabled,
    time,
    title,
    enable,
    setReminder,
    scheduleDaily,
    scheduleOnce,
    cancelAll,
  };
};
