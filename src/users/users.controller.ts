import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('usuários')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@IsPublic()
	@Post()
	@ApiCreatedResponse({ type: UserEntity })
	async create(@Body() createUserDto: CreateUserDto) {
		try {
			await this.usersService.create(createUserDto);
		} catch (error) {
			throw new ConflictException('Já existe uma conta com esse email');
		}
	}

	@Get()
	@ApiOkResponse({ type: UserEntity, isArray: true })
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: UserEntity })
	async findById(@Param('id') id: string) {
		const user = await this.usersService.findById(id);
		if (!user) {
			throw new NotFoundException('Usuário não encontrado');
		}
		return user;
	}

	@Patch(':id')
	@ApiOkResponse({ type: UserEntity })
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		const user = await this.usersService.update(id, updateUserDto);
		if (!user) {
			throw new NotFoundException('Usuário não encontrado');
		}
		return user;
	}

	@Delete(':id')
	@ApiOkResponse({ type: UserEntity })
	async remove(@Param('id') id: string) {
		const user = await this.usersService.remove(id);
		if (!user) {
			throw new NotFoundException('Usuário não encontrado');
		}
		return user;
	}
}
