import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { GetInvestigation } from '../../application/investigation/get-investigation';
import { ListInvestigations } from '../../application/investigation/list-investigations';
import { SubmitSolution } from '../../application/investigation/submit-solution';
import { SubmitSolutionDto } from './dto/submit-solution.dto';

@Controller('investigations')
export class InvestigationsController {
  constructor(
    @Inject(ListInvestigations) private readonly listInvestigations: ListInvestigations,
    @Inject(GetInvestigation) private readonly getInvestigation: GetInvestigation,
    @Inject(SubmitSolution) private readonly submitSolution: SubmitSolution,
  ) {}

  @Get()
  list() {
    return this.listInvestigations.execute();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getInvestigation.execute(id);
  }

  @Post(':id/solutions')
  solve(@Param('id') id: string, @Body() body: SubmitSolutionDto) {
    return this.submitSolution.execute({
      caseId: id,
      culprits: body.culprits,
      elapsedSeconds: body.elapsedSeconds,
    });
  }
}
