import { CASE_CATALOG } from '../../domain/investigation/case-catalog';
import { InvestigationCase } from '../../domain/investigation/investigation-case';
import { describeStatement } from '../../domain/investigation/statement';
import { Suspect, suspectsForCase } from '../../domain/investigation/suspects';

export interface InvestigationSummary {
  id: string;
  title: string;
  suspectCount: number;
  culpritCount: number;
  truthCount: { min: number; max: number };
  lieCount: { min: number; max: number };
  timeLimitsSeconds: number[];
}

export interface InvestigationView extends InvestigationSummary {
  suspects: Array<{
    id: string;
    name: string;
    number: number;
    heightCm: number;
    diet: string;
  }>;
  statements: Array<{ speakerId: string; text: string }>;
}

export function listInvestigationSummaries(): InvestigationSummary[] {
  return CASE_CATALOG.map(toSummary);
}

export function findInvestigation(id: string): InvestigationCase | undefined {
  return CASE_CATALOG.find((investigation) => investigation.id === id);
}

export function toInvestigationView(investigation: InvestigationCase): InvestigationView {
  const suspects = suspectsForCase(investigation.suspectCount);
  return {
    ...toSummary(investigation),
    suspects: suspects.map(toSuspectView),
    statements: investigation.statements.map((statement, index) => ({
      speakerId: suspects[index].id,
      text: describeStatement(statement, suspects),
    })),
  };
}

function toSummary(investigation: InvestigationCase): InvestigationSummary {
  return {
    id: investigation.id,
    title: investigation.title,
    suspectCount: investigation.suspectCount,
    culpritCount: investigation.culpritCount,
    truthCount: { min: investigation.minTruths, max: investigation.maxTruths },
    lieCount: {
      min: investigation.suspectCount - investigation.maxTruths,
      max: investigation.suspectCount - investigation.minTruths,
    },
    timeLimitsSeconds: [...investigation.timeLimitsSeconds],
  };
}

function toSuspectView(suspect: Suspect) {
  return {
    id: suspect.id,
    name: suspect.name,
    number: suspect.number,
    heightCm: suspect.heightCm,
    diet: suspect.diet,
  };
}
