import {
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guards';
import { RefreshTokenGuard } from 'src/common/guards/refesh-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser, IsPublic } from '../common/decorators';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthRequest, UserToken } from './models';

@Controller()
@ApiTags('autenticação')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@Post('login')
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: LoginRequestDto })
	@ApiOkResponse({ type: String })
	login(@CurrentUser() user: UserEntity): Promise<UserToken> {
		return this.authService.login(user);
	}

	@IsPublic()
	@Post('signin')
	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: UserEntity })
	async signup(@Body() createUserDto: CreateUserDto): Promise<UserToken> {
		try {
			return await this.authService.signup(createUserDto);
		} catch (error) {
			throw new ConflictException('Já existe uma conta com esse email');
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: String })
	async logout(@CurrentUser('id') id: UserEntity['id']) {
		console.log(id);
		await this.authService.logout(id);
	}

	@IsPublic()
	@Post('refresh')
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: String })
	async refresh(@Request() req: AuthRequest): Promise<UserToken> {
		return this.authService.refresh(req.user.sub, req.user.refreshToken);
	}
}
