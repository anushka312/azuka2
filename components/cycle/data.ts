import { DailyData } from './types';

export const dailyData: DailyData = {
  '2026-02-01': {
    phase: 'Menstrual',
    cycleDay: 1,
    cycleLength: 28,
    progress: 4,
    nextPeriod: 'Period expected in 27 days',

    energy: 'Low',
    stress: 'Moderate',
    symptoms: ['Cramps'],
    hrv: '45 ms',
    sleep: '+0.5 hrs',
    cortisol: 'Moderate',
  },

  '2026-02-02': {
    phase: 'Menstrual',
    cycleDay: 2,
    cycleLength: 28,
    progress: 7,
    nextPeriod: 'Period expected in 26 days',

    energy: 'Low',
    stress: 'High',
    symptoms: ['Fatigue', 'Cramps'],
    hrv: '42 ms',
    sleep: '+1.2 hrs',
    cortisol: 'High',
  },

  '2026-02-03': {
    phase: 'Menstrual',
    cycleDay: 3,
    cycleLength: 28,
    progress: 11,
    nextPeriod: 'Period expected in 25 days',

    energy: 'Moderate',
    stress: 'Moderate',
    symptoms: ['Fatigue'],
    hrv: '44 ms',
    sleep: '+0.8 hrs',
    cortisol: 'Moderate',
  },

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