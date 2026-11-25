import { Module } from '@nestjs/common';
import { GetInvestigation } from '../application/investigation/get-investigation';
import { ListInvestigations } from '../application/investigation/list-investigations';
import { SubmitSolution } from '../application/investigation/submit-solution';
import { InvestigationsController } from './http/investigations.controller';

@Module({
  controllers: [InvestigationsController],
  providers: [
    { provide: ListInvestigations, useFactory: () => new ListInvestigations() },
    { provide: GetInvestigation, useFactory: () => new GetInvestigation() },
    { provide: SubmitSolution, useFactory: () => new SubmitSolution() },
  ],
})
export class InvestigationModule {}
