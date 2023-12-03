import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { compare } from 'bcrypt';
import { Role } from 'src/auth/enums/roles.enum';
import { CurrentUser } from 'src/common/decorators';
import { Roles } from 'src/common/decorators';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('usuários')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

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
	@Roles(Role.User)
	async userRemoval(
		@Param('id') id: string,
		@Body() deleteUserDto: DeleteUserDto,
		@CurrentUser() user: UserEntity,
	) {
		if (user.id !== id)
			throw new ConflictException('Você não pode remover outro usuário');

		if (!deleteUserDto.password)
			throw new BadRequestException('Senha não informada');

		const hashedPassword = (await this.usersService.findByEmail(user.email))
			.password;

		const isPasswordValid = await compare(
			deleteUserDto.password,
			hashedPassword,
		);

		if (!isPasswordValid) throw new ConflictException('Senha incorreta');

		const removedUser = await this.usersService.remove(id);

		if (!removedUser) throw new NotFoundException('Usuário não encontrado');

		return removedUser;
	}

	@Delete(':id')
	@ApiOkResponse({ type: UserEntity })
	@Roles(Role.Admin)
	async adminRemoval(@Param('id') id: string, @Body() _?: DeleteUserDto) {
		const removedUser = await this.usersService.remove(id);

		if (!removedUser) throw new NotFoundException('Usuário não encontrado');

		return removedUser;
	}
}
