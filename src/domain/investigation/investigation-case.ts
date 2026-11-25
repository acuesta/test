import { Statement } from './statement';

export interface InvestigationCase {
  id: string;
  title: string;
  suspectCount: number;
  culpritCount: number;
  minTruths: number;
  maxTruths: number;
  timeLimitsSeconds: readonly [number, number, number];
  statements: readonly Statement[];
}

export function rateElapsed(elapsedSeconds: number, limits: readonly [number, number, number]): number {
  if (elapsedSeconds <= limits[0]) {
    return 3;
  }
  if (elapsedSeconds <= limits[1]) {
    return 2;
  }
  if (elapsedSeconds <= limits[2]) {
    return 1;
  }
  return 0;
}
