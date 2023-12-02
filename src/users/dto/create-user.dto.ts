import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@IsStrongPassword()
	@ApiProperty()
	password: string;
}
