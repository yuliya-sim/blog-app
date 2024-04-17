import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateBlogDto {
    readonly id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Optional()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Optional()
    content: string;
}
