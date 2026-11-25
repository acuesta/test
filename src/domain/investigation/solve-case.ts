import { InvestigationCase } from './investigation-case';
import { evaluateStatement } from './statement';
import { Suspect, SuspectId, suspectsForCase } from './suspects';

export function solveCase(investigation: InvestigationCase): SuspectId[][] {
  const suspects = suspectsForCase(investigation.suspectCount);
  if (investigation.statements.length !== suspects.length) {
    throw new Error(`Case ${investigation.id} must have one statement per suspect`);
  }

  const ids = suspects.map((suspect) => suspect.id);
  const solutions: SuspectId[][] = [];

  for (const guilty of combinations(ids, investigation.culpritCount)) {
    const guiltySet = new Set(guilty);
    const matches = truthAssignments(ids, investigation.minTruths, investigation.maxTruths).some(
      (truthful) => worldAgrees(investigation, suspects, guiltySet, new Set(truthful)),
    );
    if (matches) {
      solutions.push([...guilty].sort());
    }
  }

  return solutions;
}

function worldAgrees(
  investigation: InvestigationCase,
  suspects: readonly Suspect[],
  guilty: ReadonlySet<SuspectId>,
  truthful: ReadonlySet<SuspectId>,
): boolean {
  return suspects.every((suspect, index) => {
    const claimed = evaluateStatement(
      investigation.statements[index],
      index,
      suspects,
      guilty,
      truthful,
    );
    return claimed === truthful.has(suspect.id);
  });
}

function truthAssignments(ids: readonly SuspectId[], min: number, max: number): SuspectId[][] {
  const assignments: SuspectId[][] = [];
  for (let count = min; count <= max; count += 1) {
    assignments.push(...combinations(ids, count));
  }
  return assignments;
}

function combinations<T>(items: readonly T[], count: number): T[][] {
  const results: T[][] = [];
  const current: T[] = [];

  const walk = (start: number): void => {
    if (current.length === count) {
      results.push([...current]);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      current.push(items[index]);
      walk(index + 1);
      current.pop();
    }
  };

  walk(0);
  return results;
}
