import { Module } from '@nestjs/common';
import { AmortizationScheduleService } from './amortization-schedule.service';
import { AmortizationScheduleController } from './amortization.schedule.controller';


@Module({
  controllers: [AmortizationScheduleController],
  providers: [AmortizationScheduleService],
  exports: [AmortizationScheduleService],
})
export class AmortizationScheduleModule { }
