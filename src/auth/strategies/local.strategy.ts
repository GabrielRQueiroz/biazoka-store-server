import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserFromJwt } from '../models';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
		});
	}

	async validate(email: string, password: string): Promise<UserFromJwt> {
		const user = await this.authService.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('Email ou senha incorretos');
		}
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		};
	}
}
