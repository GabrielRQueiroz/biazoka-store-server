import {
	ConflictException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { UserToken } from 'src/auth/models';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async login(user: UserEntity): Promise<UserToken> {
		return await this.getTokens(user);
	}

	async signup(createUserDto: CreateUserDto) {
		const hashedPassword = await this.hashData(createUserDto.password);

		const user = await this.prisma.user.create({
			data: {
				...createUserDto,
				password: hashedPassword,
			},
		});

		if (!user)
			throw new ConflictException(
				'Já existe usuário com o email ' + createUserDto.email,
			);

		const tokens = await this.getTokens(user);

		await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

		return tokens;
	}

	async logout(userId: string) {
		await this.prisma.user.updateMany({
			where: { id: userId, refreshToken: { not: null } },
			data: { refreshToken: null },
		});
	}

	async refresh(userId: string, refreshToken: string): Promise<UserToken> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user || !user.refreshToken)
			throw new ForbiddenException('No user found');

		const refreshTokenMatches = await compare(
			refreshToken,
			user.refreshToken,
		);
		if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

		const tokens = await this.getTokens(user);
		await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

		return tokens;
	}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByEmail(email);

		if (user) {
			const isPasswordValid = await compare(password, user.password);

			if (isPasswordValid) {
				const tokens = await this.getTokens(user);
				await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

				return {
					...user,
					password: undefined,
				};
			}

			throw new UnauthorizedException('Email ou senha incorretos');
		} else {
			throw new UnauthorizedException('Email ou senha incorretos');
		}
	}

	hashData(data: string): Promise<string> {
		return hash(data, 10);
	}

	async getTokens(user: UserEntity): Promise<UserToken> {
		const userPayload = {
			sub: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		};

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(userPayload, {
				secret: process.env.JWT_SECRET,
				expiresIn: 60 * 5,
			}),
			this.jwtService.signAsync(userPayload, {
				secret: process.env.RT_SECRET,
				expiresIn: 60 * 60 * 24 * 7,
			}),
		]);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	async updateRefreshTokenHash(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.hashData(refreshToken);

		await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: hashedRefreshToken },
		});
	}
}
