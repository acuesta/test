import { CaseNotFound } from '../../domain/investigation/investigation.errors';
import { InvestigationView, findInvestigation, toInvestigationView } from './investigation-view';

export class GetInvestigation {
  execute(id: string): InvestigationView {
    const investigation = findInvestigation(id);
    if (!investigation) {
      throw new CaseNotFound();
    }
    return toInvestigationView(investigation);
  }
}
