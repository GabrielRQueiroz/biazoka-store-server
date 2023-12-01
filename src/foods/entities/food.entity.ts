import { ApiProperty } from '@nestjs/swagger';
import { Food } from '@prisma/client';

export class FoodEntity implements Food {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	price: number;

	@ApiProperty({ required: false })
	image: string;

	@ApiProperty({ required: false })
	quantity: number;

	@ApiProperty({ required: false })
	type: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
