import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
	constructor(private prisma: PrismaService) {}

	create(createFoodDto: CreateFoodDto) {
		return this.prisma.food.create({
			data: createFoodDto,
		});
	}

	findAll() {
		return this.prisma.food.findMany();
	}

	findOne(id: number) {
		return this.prisma.food.findUnique({
			where: { id: id },
		});
	}

	update(id: number, updateFoodDto: UpdateFoodDto) {
		return this.prisma.food.update({
			where: { id: id },
			data: updateFoodDto,
		});
	}

	remove(id: number) {
		return this.prisma.food.delete({
			where: { id: id },
		});
	}
}
