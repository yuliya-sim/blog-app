import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateScheduleDto } from '../amortization/dtos';
import { queryCreateProcedure, queryCreateTemporaryTable } from './constants';

@Injectable()
export class AmortizationScheduleService {
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
        await this.entityManager.query(queryCreateTemporaryTable);
    }
    async generateAmortizationSchedule(): Promise<any> {
        try {
            await this.entityManager.query(`
            ${queryCreateProcedure}    
             `);
        } catch (err) {
            throw new BadRequestException();
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
            throw new BadRequestException();
        }
    }
}
