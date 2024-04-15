import { Body, Controller, Get, Post } from '@nestjs/common';
import { AmortizationScheduleService } from './amortization-schedule.service';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from './dtos';

@ApiTags('schedule')
@Controller('schedule')
@ApiBadRequestResponse({ description: 'Bad Request' })
export class AmortizationScheduleController {
    constructor(private readonly amortizationService: AmortizationScheduleService) { }

    @Get('generate-amortization-schedule')
    @ApiOperation({
        summary: 'Generate amortization schedule',
    })
    async generateAmortizationSchedule(): Promise<void> {
        return await this.amortizationService.generateAmortizationSchedule();
    }
    @Post('call-amortization-schedule')
    @ApiOperation({
        summary: 'Call amortization schedule',
    })
    @ApiBody({ type: CreateScheduleDto })
    async callAmortizationSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<CreateScheduleDto> {
        return await this.amortizationService.callAmortizationSchedule(createScheduleDto);
    }
}
