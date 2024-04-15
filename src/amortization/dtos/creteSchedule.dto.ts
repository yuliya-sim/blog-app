import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateScheduleDto {
    @ApiProperty({ description: 'The loan amount', example: 36000 })
    @IsNumber()
    @IsPositive()
    loan_amount: number;

    @ApiProperty({ description: 'The annual interest rate', example: 8 })
    @IsNumber()
    @IsPositive()
    annual_interest_rate: number;

    @ApiProperty({ description: 'The total number of payments', example: 36 })
    @IsNumber()
    @IsPositive()
    total_payments: number;

    @ApiProperty({ description: 'The interest rate recycled', example: 4.5 })
    @IsNumber()
    @IsPositive()
    interest_rate_recycled: number;

    @ApiProperty({ description: 'The month after which to recalculate', example: 12 })
    @IsNumber()
    @IsPositive()
    month_recalculate_loan: number;
}
