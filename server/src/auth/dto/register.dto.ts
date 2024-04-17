
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsEmail,
    IsStrongPassword,
    MaxLength,
    Validate,
    IsOptional,
} from 'class-validator';
import { Index } from 'typeorm';
import { IsPasswordsMatching } from '../../../libs/shared/src/decorators/password-match';
export class RegisterDto {
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
        description: 'Should repeat the password of the user.',
    })
    @Validate(IsPasswordsMatching)

    @ApiProperty({
        description: 'Should repeat the password of the user.',
        required: false,
    })
    @IsOptional()
    @Validate(IsPasswordsMatching)
    passwordRepeat?: string;

    @ApiProperty({
        description: 'First name of the user.',
        required: false,
    })
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        description: 'Last name of the user.',
        required: false,
    })
    @IsOptional()
    lastName?: string;



}
