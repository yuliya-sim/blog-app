import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';
import { Index } from 'typeorm';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Index({ unique: true })
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    })
    @ApiProperty({
        description:
            'Password of the user.Should be strong: 8 characters long, with at least 1 lowercase, 1 uppercase, 1 number and 0 symbols',
    })
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    role: string;
}

