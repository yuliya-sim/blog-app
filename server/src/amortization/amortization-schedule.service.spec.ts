import { Test, TestingModule } from '@nestjs/testing';
import { AmortizationScheduleService } from './amortization-schedule.service';

describe('AmortizationService', () => {
  let service: AmortizationScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmortizationScheduleService],
    }).compile();

    service = module.get<AmortizationScheduleService>(AmortizationScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
