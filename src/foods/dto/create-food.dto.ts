import { ApiProperty } from '@nestjs/swagger';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

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
	@IsOptional()
	@ApiProperty()
	image?: string;

	@IsInt()
	@IsOptional()
	@ApiProperty()
	quantity?: number;

	@IsString()
	@IsOptional()
	@ApiProperty()
	type?: string;
}
