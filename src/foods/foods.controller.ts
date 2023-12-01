import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodsService } from './foods.service';

@Controller('foods')
@ApiTags('comidas')
export class FoodsController {
	constructor(private readonly foodsService: FoodsService) {}

	@Post()
	@ApiCreatedResponse({ type: CreateFoodDto })
	create(@Body() createFoodDto: CreateFoodDto) {
		return this.foodsService.create(createFoodDto);
	}

	@Get()
	@ApiOkResponse({ type: CreateFoodDto, isArray: true })
	findAll() {
		return this.foodsService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: CreateFoodDto })
	findOne(@Param('id') id: string) {
		return this.foodsService.findOne(+id);
	}

	@Patch(':id')
	@ApiOkResponse({ type: CreateFoodDto })
	update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
		return this.foodsService.update(+id, updateFoodDto);
	}

	@Delete(':id')
	@ApiOkResponse({ type: CreateFoodDto })
	remove(@Param('id') id: string) {
		return this.foodsService.remove(+id);
	}
}
