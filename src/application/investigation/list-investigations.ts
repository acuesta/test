import { InvestigationSummary, listInvestigationSummaries } from './investigation-view';

export class ListInvestigations {
  execute(): InvestigationSummary[] {
    return listInvestigationSummaries();
  }
}
