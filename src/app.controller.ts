import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { UserEntity } from './users/entities/user.entity';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@IsPublic()
	@Get()
	@ApiOkResponse({ type: String })
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('profile')
	@ApiOkResponse({ type: UserEntity })
	getProfile(@CurrentUser() user: UserEntity) {
		return user;
	}
}
