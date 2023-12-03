import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
	@IsString()
	@IsNotEmpty()
	password: string;
}
