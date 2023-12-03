export class UserFromRefresh {
	sub: string;
	email: string;
	name: string;
	role: string;
	refreshToken: string;
	iat?: number;
	exp?: number;
}
