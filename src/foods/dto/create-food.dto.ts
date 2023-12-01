import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFoodDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@ApiProperty()
	name: string;

	@IsInt()
	@IsNotEmpty()
	@ApiProperty()
	price: number;

	@IsString()
	@ApiProperty()
	image?: string;

	@IsInt()
	@ApiProperty()
	quantity?: number;

	@IsString()
	@ApiProperty()
	type?: string;
}
