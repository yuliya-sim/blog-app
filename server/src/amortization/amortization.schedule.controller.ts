import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AmortizationScheduleService } from './amortization-schedule.service';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from './dtos';
import { AuthService } from '../auth/auth.service';

@ApiTags('schedule')
@Controller('schedule')
@ApiBadRequestResponse({ description: 'Bad Request' })
export class AmortizationScheduleController {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly amortizationService: AmortizationScheduleService) { }

    @Get('generate-amortization-schedule')
    @ApiOperation({
        summary: 'Generate amortization schedule',
    })
    async generateAmortizationSchedule(): Promise<void> {
        try {
            return await this.amortizationService.generateAmortizationSchedule();
        } catch (err) {
            this.logger.error('Error in generateAmortizationSchedule', err);
            throw err;
        }
    }
    @Post('call-amortization-schedule')
    @ApiOperation({
        summary: 'Call amortization schedule',
    })
    @ApiBody({ type: CreateScheduleDto })
    async callAmortizationSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<CreateScheduleDto> {
        try {
            return await this.amortizationService.callAmortizationSchedule(createScheduleDto);
        } catch (err) {
            this.logger.error('Error in callAmortizationSchedule', err);
            throw err;
        }
    }
}
