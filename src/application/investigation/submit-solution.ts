import { rateElapsed } from '../../domain/investigation/investigation-case';
import { CaseNotFound, InvalidGuess } from '../../domain/investigation/investigation.errors';
import { solveCase } from '../../domain/investigation/solve-case';
import { SuspectId, suspectsForCase } from '../../domain/investigation/suspects';
import { findInvestigation } from './investigation-view';

export interface SubmitSolutionInput {
  caseId: string;
  culprits: string[];
  elapsedSeconds: number;
}

export interface SolutionResult {
  correct: boolean;
  stars: number;
  culprits: SuspectId[];
}

export class SubmitSolution {
  execute(input: SubmitSolutionInput): SolutionResult {
    const investigation = findInvestigation(input.caseId);
    if (!investigation) {
      throw new CaseNotFound();
    }

    const allowed = new Set(suspectsForCase(investigation.suspectCount).map((suspect) => suspect.id));
    const guessed = new Set(input.culprits);
    const guessIsWellFormed =
      guessed.size === investigation.culpritCount &&
      input.culprits.length === investigation.culpritCount &&
      input.culprits.every((id) => allowed.has(id as SuspectId));
    if (!guessIsWellFormed) {
      throw new InvalidGuess();
    }

    const solutions = solveCase(investigation);
    if (solutions.length !== 1) {
      throw new Error(`Case ${investigation.id} does not have one solution`);
    }

    const [solution] = solutions;
    const correct = solution.every((id) => guessed.has(id));
    return {
      correct,
      stars: correct ? rateElapsed(input.elapsedSeconds, investigation.timeLimitsSeconds) : 0,
      culprits: solution,
    };
  }
}
