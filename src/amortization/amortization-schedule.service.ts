import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateScheduleDto } from 'src/amortization/dtos/creteSchedule.dto';
import { queryCreateProcedure, queryCreateTemporaryTable } from './constants';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AmortizationScheduleService {

    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }


    queryToCallProcedure = ({
        loan_amount,
        annual_interest_rate,
        total_payments,
        interest_rate_recycled,
        month_recalculate_loan,
    }) =>
        `SELECT * FROM generate_amortization_schedule(${loan_amount}, ${annual_interest_rate}, ${total_payments}, ${interest_rate_recycled}, ${month_recalculate_loan});`;
    dropTemporaryTable = `DROP TABLE if exists temp_amortization_schedule;`;

    dropFunction = ``;

    async createTemporaryTable(): Promise<void> {
        try {
            await this.entityManager.query(queryCreateTemporaryTable);
        } catch (err) {
            this.logger.error('Error in createTemporaryTable', err);
            throw new Error();
        }
    }
    async generateAmortizationSchedule(): Promise<void> {
        try {
            await this.entityManager.query(`
            ${queryCreateProcedure}    
             `);
        } catch (err) {
            this.logger.error('Error in generateAmortizationSchedule', err);
            throw new Error();
        }
    }
    async callAmortizationSchedule(createScheduleDto: CreateScheduleDto): Promise<CreateScheduleDto> {
        const { loan_amount, annual_interest_rate, total_payments, interest_rate_recycled, month_recalculate_loan } =
            createScheduleDto;

        try {
            return await this.entityManager.query(`
            ${this.queryToCallProcedure({ loan_amount, annual_interest_rate, total_payments, interest_rate_recycled, month_recalculate_loan })}
            `);
        } catch (err) {
            this.logger.error('Error in callAmortizationSchedule', err);
            throw new Error();
        }
    }
}
