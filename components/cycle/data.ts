import { DailyData } from './types';

/**
 * Helper function to programmatically generate mock data 
 * for a 5-day menstrual period starting on any date string (YYYY-MM-DD).
 */
export function generateMockPeriodRange(startDateStr: string, duration: number = 5): DailyData {
  const periodData: DailyData = {};
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);

  for (let i = 0; i < duration; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const cycleDay = i + 1;
    const daysRemaining = 28 - cycleDay;

    periodData[dateKey] = {
      phase: 'Menstrual',
      cycleDay: cycleDay,
      cycleLength: 28,
      progress: Math.round((cycleDay / 28) * 100),
      nextPeriod: `Period expected in ${daysRemaining} days`,
      energy: i < 2 ? 'Low' : 'Moderate',
      stress: i < 2 ? 'High' : 'Moderate',
      symptoms: i === 0 ? ['Cramps'] : i === 1 ? ['Cramps', 'Fatigue'] : ['Light Flow'],
      hrv: `${42 + i} ms`,
      sleep: `+${(1.2 - i * 0.2).toFixed(1)} hrs`,
      cortisol: i < 2 ? 'High' : 'Moderate',
    };
  }

  return periodData;
}

/* =======================================================
   MOCKED DATASET
   Pre-filled with a complete 5-day Menstrual window:
   Feb 01, Feb 02, Feb 03, Feb 04, Feb 05
======================================================= */
export const dailyData: DailyData = {
  // --- 5-DAY MOCKED PERIOD WINDOW ---
  ...generateMockPeriodRange('2026-02-01', 5),

  // --- REST OF CYCLE MOCK DATA ---
  '2026-02-08': {
    phase: 'Follicular',
    cycleDay: 8,
    cycleLength: 28,
    progress: 29,
    nextPeriod: 'Next period expected in 20 days',
    energy: 'High',
    stress: 'Low',
    symptoms: [],
    hrv: '58 ms',
    sleep: '-0.2 hrs',
    cortisol: 'Low',
  },

  '2026-02-12': {
    phase: 'Follicular',
    cycleDay: 12,
    cycleLength: 28,
    progress: 43,
    nextPeriod: 'Next period expected in 16 days',
    energy: 'High',
    stress: 'Low',
    symptoms: [],
    hrv: '61 ms',
    sleep: '-0.5 hrs',
    cortisol: 'Low',
  },

  '2026-02-16': {
    phase: 'Ovulation',
    cycleDay: 16,
    cycleLength: 28,
    progress: 57,
    nextPeriod: 'Next period expected in 12 days',
    energy: 'High',
    stress: 'Low',
    symptoms: ['Increased appetite'],
    hrv: '64 ms',
    sleep: '-0.3 hrs',
    cortisol: 'Low',
  },

  '2026-02-20': {
    phase: 'Luteal',
    cycleDay: 20,
    cycleLength: 28,
    progress: 71,
    nextPeriod: 'Next period expected in 8 days',
    energy: 'Moderate',
    stress: 'Moderate',
    symptoms: ['Craving'],
    hrv: '51 ms',
    sleep: '+0.4 hrs',
    cortisol: 'Moderate',
  },

  '2026-02-22': {
    phase: 'Luteal',
    cycleDay: 22,
    cycleLength: 28,
    progress: 79,
    nextPeriod: 'Next period expected in 6 days',
    energy: 'Moderate',
    stress: 'Moderate',
    symptoms: ['Fatigue', 'Craving'],
    hrv: '48 ms',
    sleep: '+0.8 hrs',
    cortisol: 'Moderate',
  },

  '2026-02-28': {
    phase: 'Late Luteal',
    cycleDay: 28,
    cycleLength: 28,
    progress: 100,
    nextPeriod: 'Next period expected in 1 day',
    energy: 'Low',
    stress: 'High',
    symptoms: ['Fatigue', 'Craving', 'Bloating'],
    hrv: '42 ms',
    sleep: '+1.5 hrs',
    cortisol: 'High',
  },
};