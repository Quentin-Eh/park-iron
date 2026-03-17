export type Experience = 'beginner' | '6-12mo' | '1-3yr' | '3yr+';

export type Equipment =
  | 'pullup_bar'
  | 'rings'
  | 'parallettes'
  | 'dip_station'
  | 'resistance_bands'
  | 'none';

export type Goal = 'muscle' | 'strength' | 'lean' | 'fitness';

export type DaysPerWeek = 2 | 3 | 4 | 5;

export type SessionLength = '20-30' | '30-45' | '45-60' | '60+';

export interface OnboardingAnswers {
  experience: Experience;
  equipment: Equipment[];
  goal: Goal;
  days: DaysPerWeek;
  sessionLength: SessionLength;
}
