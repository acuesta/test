import { Module } from '@nestjs/common';
import { InvestigationModule } from './infrastructure/investigation.module';
import { UserModule } from './infrastructure/user.module';

@Module({
  imports: [UserModule, InvestigationModule],
})
export class AppModule {}
