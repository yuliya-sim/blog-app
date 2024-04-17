import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsStrongPassword, MaxLength } from 'class-validator';
import { Index } from 'typeorm';

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Index({ unique: true })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    })
    @MaxLength(20)
    @ApiProperty({
        description:
            'Password of the user.Should be strong: 8 characters long, with at least 1 lowercase, 1 uppercase, 1 number and 0 symbols',
    })
    password: string;
}
