import { Test } from '@nestjs/testing';
import { AmortizationScheduleService } from './amortization-schedule.service';
import { AmortizationScheduleController } from './amortization.schedule.controller';
import { CreateScheduleDto } from './dtos';
import { EntityManager } from 'typeorm';

describe('AmortizationScheduleController', () => {
    let controller: AmortizationScheduleController;
    let service: AmortizationScheduleService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AmortizationScheduleController],
            providers: [AmortizationScheduleService, EntityManager],
        }).compile();

        controller = moduleRef.get<AmortizationScheduleController>(AmortizationScheduleController);
        service = moduleRef.get<AmortizationScheduleService>(AmortizationScheduleService);
    });

    describe('generateAmortizationSchedule', () => {
        it('should generate amortization schedule', async () => {
            jest.spyOn(service, 'generateAmortizationSchedule').mockResolvedValueOnce();
            await expect(controller.generateAmortizationSchedule()).resolves.not.toThrow();
        });
    });

    describe('callAmortizationSchedule', () => {
        const createScheduleDto: CreateScheduleDto = {
            loan_amount: 1000,
            annual_interest_rate: 0.05,
            total_payments: 12,
            interest_rate_recycled: 0.05,
            month_recalculate_loan: 1,
        };

        it('should call amortization schedule', async () => {
            jest.spyOn(service, 'callAmortizationSchedule').mockResolvedValueOnce(createScheduleDto);
            await expect(controller.callAmortizationSchedule(createScheduleDto)).resolves.toEqual(createScheduleDto);
        });
    });
});
