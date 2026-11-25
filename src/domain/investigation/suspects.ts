export type Diet = 'carnivore' | 'herbivore';

export type SuspectId =
  | 'panther'
  | 'peacock'
  | 'shark'
  | 'iguana'
  | 'dog'
  | 'horse'
  | 'bear';

export interface Suspect {
  id: SuspectId;
  name: string;
  number: number;
  heightCm: number;
  diet: Diet;
}

// Heights and seating order match the suspect cards. Diet icons are not printed
// as text in the rulebook, so each diet follows the animal.
export const ROSTER: readonly Suspect[] = [
  { id: 'panther', name: 'Panther', number: 1, heightCm: 178, diet: 'carnivore' },
  { id: 'peacock', name: 'Peacock', number: 2, heightCm: 169, diet: 'herbivore' },
  { id: 'shark', name: 'Shark', number: 3, heightCm: 192, diet: 'carnivore' },
  { id: 'iguana', name: 'Iguana', number: 4, heightCm: 162, diet: 'herbivore' },
  { id: 'dog', name: 'Dog', number: 5, heightCm: 173, diet: 'carnivore' },
  { id: 'horse', name: 'Horse', number: 6, heightCm: 200, diet: 'herbivore' },
  { id: 'bear', name: 'Bear', number: 7, heightCm: 184, diet: 'carnivore' },
];

export function suspectsForCase(count: number): Suspect[] {
  if (count < 1 || count > ROSTER.length) {
    throw new Error(`A case uses between 1 and ${ROSTER.length} suspects`);
  }
  return ROSTER.slice(0, count);
}
