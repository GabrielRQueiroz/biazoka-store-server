import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromRefresh, UserPayload } from '../models';

export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.RT_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(
		req: Request,
		payload: UserPayload,
	): Promise<UserFromRefresh> {
		const refreshToken = req
			.get('authorization')
			.replace('Bearer ', '')
			.trim();

		return {
			...payload,
			refreshToken,
		};
	}
}
