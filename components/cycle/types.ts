export type SymptomSeverity =
  | 'Mild'
  | 'Moderate'
  | 'Severe';

export type SymptomCategory =
  | 'Pain'
  | 'Energy'
  | 'Digestive'
  | 'Appetite'
  | 'Mood'
  | 'Physical'
  | 'Other';

export type LoggedSymptom = {
  id: string;
  name: string;
  category: SymptomCategory;
  severity: SymptomSeverity;
  detail?: string;
};

export type FlowRate = 'Light' | 'Medium' | 'Heavy' | 'Spotting';

export type LoggedPeriod = {
  isPeriodDay: boolean;
  flowRate?: FlowRate;
};

// Update your main payload or props type:
export type LoggedCheckIn = {
  symptoms: LoggedSymptom[];
  period?: LoggedPeriod;
};

export type DayInfo = {
  phase: string;
  energy: string;
  stress: string;
  symptoms: string[];
  hrv: string;
  sleep: string;
  cortisol: string;

  symptomRecords?: LoggedSymptom[];

  cycleDay?: number;
  cycleLength?: number;
  progress?: number;
  nextPeriod?: string;
};

export type DailyData = Record<
  string,
  DayInfo
>;