import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;
}
