import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/common/decorators';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodEntity } from './entities/food.entity';
import { FoodsService } from './foods.service';

@Controller('foods')
@ApiTags('comidas')
export class FoodsController {
	constructor(private readonly foodsService: FoodsService) {}

	@Post()
	@ApiCreatedResponse({ type: CreateFoodDto })
	@Roles(Role.Admin)
	async create(@Body() createFoodDto: CreateFoodDto) {
		try {
			return await this.foodsService.create(createFoodDto);
		} catch (error) {
			throw new ConflictException('Já existe uma comida com esse nome');
		}
	}

	@Get()
	@ApiOkResponse({ type: FoodEntity, isArray: true })
	findAll() {
		return this.foodsService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: FoodEntity })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const food = await this.foodsService.findOne(id);
		if (!food) {
			throw new NotFoundException('Comida não encontrada');
		}
		return food;
	}

	@Patch(':id')
	@ApiOkResponse({ type: FoodEntity })
	@Roles(Role.Admin)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateFoodDto: UpdateFoodDto,
	) {
		const food = await this.foodsService.update(id, updateFoodDto);
		if (!food) {
			throw new NotFoundException('Comida não encontrada');
		}
		return food;
	}

	@Delete(':id')
	@ApiOkResponse({ type: FoodEntity })
	@Roles(Role.Admin)
	async remove(@Param('id', ParseIntPipe) id: number) {
		const food = await this.foodsService.remove(id);
		if (!food) {
			throw new NotFoundException('Comida não encontrada');
		}
		return food;
	}
}
