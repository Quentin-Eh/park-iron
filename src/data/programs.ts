import type { Program } from '../types/program.ts';
import { DEFAULT_PROGRAM } from './default-program.ts';
import { HEAVY_DUTY_PROGRAM } from './heavy-duty-program.ts';

/**
 * The library of built-in programs. A user's active program is looked up
 * by id from this list (with `pi-program` acting as an override for any
 * customizations made to the currently active program).
 */
export const PROGRAMS: Program[] = [DEFAULT_PROGRAM, HEAVY_DUTY_PROGRAM];

export function getProgramById(id: string): Program | null {
  return PROGRAMS.find(p => p.id === id) ?? null;
}

export const DEFAULT_ACTIVE_PROGRAM_ID = DEFAULT_PROGRAM.id;
