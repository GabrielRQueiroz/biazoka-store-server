import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserToken } from 'src/auth/models/UserToken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from './models/UserPayload';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	login(user: UserEntity): UserToken {
		const payload: UserPayload = {
			sub: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		};

		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByEmail(email);

		if (user) {
			const isPasswordValid = await compare(password, user.password);

			if (isPasswordValid) {
				return {
					...user,
					password: undefined,
				};
			}
		} else {
			throw new UnauthorizedException('Email ou senha incorretos');
		}
	}
}
