import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';

@Controller()
@ApiTags('autenticação')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: LoginRequestDto })
	@ApiOkResponse({ type: String })
	login(@Request() req: AuthRequest) {
		return this.authService.login(req.user);
	}
}
