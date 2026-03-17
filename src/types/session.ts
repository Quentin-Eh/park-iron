export type SessionData = Record<string, number[]>;

export interface Session {
  id: number;
  day: string;
  date: string;
  endDate: string;
  exercises: SessionData;
  progressions: Record<string, number>;
  coachingFeedback?: string;
}

export interface SessionDraft {
  day: string;
  data: SessionData;
  start: string;
  currentStep: number;
  savedAt: string;
}
