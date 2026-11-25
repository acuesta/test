import { Diet, Suspect, SuspectId } from './suspects';

export type Statement =
  | { kind: 'self-innocent' }
  | { kind: 'accused'; suspectId: SuspectId }
  | { kind: 'any-accused'; suspectIds: SuspectId[] }
  | { kind: 'innocent'; suspectId: SuspectId }
  | { kind: 'diet'; diet: Diet }
  | { kind: 'taller-than'; heightCm: number }
  | { kind: 'shorter-than'; heightCm: number }
  | { kind: 'taller-than-speaker' }
  | { kind: 'lying'; suspectIds: SuspectId[] }
  | { kind: 'truthful'; suspectId: SuspectId }
  | { kind: 'neighbor-guilty' }
  | { kind: 'culprit-lying' };

export function evaluateStatement(
  statement: Statement,
  speakerIndex: number,
  suspects: readonly Suspect[],
  guilty: ReadonlySet<SuspectId>,
  truthful: ReadonlySet<SuspectId>,
): boolean {
  const speaker = suspects[speakerIndex];
  switch (statement.kind) {
    case 'self-innocent':
      return !guilty.has(speaker.id);
    case 'accused':
      return guilty.has(statement.suspectId);
    case 'any-accused':
      return statement.suspectIds.some((id) => guilty.has(id));
    case 'innocent':
      return !guilty.has(statement.suspectId);
    case 'diet':
      return [...guilty].some((id) => suspectById(suspects, id).diet === statement.diet);
    case 'taller-than':
      return [...guilty].some((id) => suspectById(suspects, id).heightCm > statement.heightCm);
    case 'shorter-than':
      return [...guilty].some((id) => suspectById(suspects, id).heightCm < statement.heightCm);
    case 'taller-than-speaker':
      return [...guilty].some((id) => suspectById(suspects, id).heightCm > speaker.heightCm);
    case 'lying':
      return statement.suspectIds.every((id) => !truthful.has(id));
    case 'truthful':
      return truthful.has(statement.suspectId);
    case 'neighbor-guilty':
      return neighborIndexes(speakerIndex, suspects.length).some((index) =>
        guilty.has(suspects[index].id),
      );
    case 'culprit-lying':
      return [...guilty].some((id) => !truthful.has(id));
  }
}

export function describeStatement(
  statement: Statement,
  suspects: readonly Suspect[],
): string {
  const nameOf = (id: SuspectId) => suspectById(suspects, id).name;
  switch (statement.kind) {
    case 'self-innocent':
      return 'I did not do it.';
    case 'accused':
      return `${nameOf(statement.suspectId)} did it.`;
    case 'any-accused':
      return `${statement.suspectIds.map(nameOf).join(' or ')} did it.`;
    case 'innocent':
      return `${nameOf(statement.suspectId)} did not do it.`;
    case 'diet':
      return `A ${statement.diet} did it.`;
    case 'taller-than':
      return `Someone taller than ${statement.heightCm} cm did it.`;
    case 'shorter-than':
      return `Someone shorter than ${statement.heightCm} cm did it.`;
    case 'taller-than-speaker':
      return 'Someone taller than me did it.';
    case 'lying':
      return statement.suspectIds.length === 1
        ? `${nameOf(statement.suspectIds[0])} is lying.`
        : `${statement.suspectIds.map(nameOf).join(' and ')} are lying.`;
    case 'truthful':
      return `${nameOf(statement.suspectId)} is telling the truth.`;
    case 'neighbor-guilty':
      return 'Someone next to me did it.';
    case 'culprit-lying':
      return 'A culprit is lying.';
  }
}

function suspectById(suspects: readonly Suspect[], id: SuspectId): Suspect {
  const found = suspects.find((suspect) => suspect.id === id);
  if (!found) {
    throw new Error(`Unknown suspect ${id}`);
  }
  return found;
}

function neighborIndexes(index: number, count: number): number[] {
  return [(index - 1 + count) % count, (index + 1) % count];
}
