import { InvestigationCase } from './investigation-case';

export const CASE_CATALOG: readonly InvestigationCase[] = [
  {
    id: 'taller-than-190',
    title: 'Someone taller than 190 cm',
    suspectCount: 3,
    culpritCount: 1,
    minTruths: 2,
    maxTruths: 2,
    timeLimitsSeconds: [120, 240, 480],
    statements: [
      { kind: 'taller-than', heightCm: 190 },
      { kind: 'self-innocent' },
      { kind: 'lying', suspectIds: ['peacock'] },
    ],
  },
  {
    id: 'shorter-than-170',
    title: 'Someone shorter than 170 cm',
    suspectCount: 3,
    culpritCount: 1,
    minTruths: 2,
    maxTruths: 2,
    timeLimitsSeconds: [120, 240, 480],
    statements: [
      { kind: 'shorter-than', heightCm: 170 },
      { kind: 'taller-than', heightCm: 170 },
      { kind: 'lying', suspectIds: ['peacock'] },
    ],
  },
  {
    id: 'shark-in-the-circle',
    title: 'Shark in the circle',
    suspectCount: 4,
    culpritCount: 1,
    minTruths: 3,
    maxTruths: 3,
    timeLimitsSeconds: [180, 360, 600],
    statements: [
      { kind: 'self-innocent' },
      { kind: 'diet', diet: 'carnivore' },
      { kind: 'self-innocent' },
      { kind: 'accused', suspectId: 'shark' },
    ],
  },
  {
    id: 'two-culprits',
    title: 'Two culprits',
    suspectCount: 3,
    culpritCount: 2,
    minTruths: 1,
    maxTruths: 1,
    timeLimitsSeconds: [240, 480, 720],
    statements: [
      { kind: 'diet', diet: 'herbivore' },
      { kind: 'self-innocent' },
      { kind: 'accused', suspectId: 'panther' },
    ],
  },
];
