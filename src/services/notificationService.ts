// Browser Notification Service for medication reminders

let notificationTimers: ReturnType<typeof setTimeout>[] = [];

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function sendNotification(title: string, body: string, onClick?: () => void) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  
  const notification = new Notification(title, {
    body,
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    tag: 'med-reminder',
    requireInteraction: true,
  });
  
  if (onClick) {
    notification.onclick = () => {
      window.focus();
      onClick();
      notification.close();
    };
  }

  // Auto-close after 30s
  setTimeout(() => notification.close(), 30000);
}

interface MedSchedule {
  name: string;
  dose: string;
  time: string; // HH:MM
  instruction: string;
}

export function scheduleMedicationReminders(
  meds: MedSchedule[],
  advanceMinutes: number = 15
) {
  // Clear existing timers
  clearAllReminders();

  const now = new Date();
  
  meds.forEach(med => {
    const [hours, minutes] = med.time.split(':').map(Number);
    const medTime = new Date(now);
    medTime.setHours(hours, minutes, 0, 0);
    
    // Reminder time (advance)
    const reminderTime = new Date(medTime.getTime() - advanceMinutes * 60 * 1000);
    
    // Only schedule future reminders
    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      const timer = setTimeout(() => {
        sendNotification(
          `⏰ 用药提醒 - ${med.name}`,
          `${med.dose} · ${med.instruction}\n${advanceMinutes}分钟后需要服药 (${med.time})`
        );
      }, delay);
      notificationTimers.push(timer);
    }
    
    // Exact time reminder
    if (medTime > now) {
      const delay = medTime.getTime() - now.getTime();
      const timer = setTimeout(() => {
        sendNotification(
          `💊 该服药了 - ${med.name}`,
          `${med.dose} · ${med.instruction}\n请立即服药`
        );
      }, delay);
      notificationTimers.push(timer);
    }
  });

  return notificationTimers.length;
}

export function clearAllReminders() {
  notificationTimers.forEach(t => clearTimeout(t));
  notificationTimers = [];
}
