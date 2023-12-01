import { AbstractHttpAdapter } from '@nestjs/core';

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}
	catch(exception: HttpException, host: ArgumentsHost) {
		let errorMessage: unknown;
		let httpStatus: number;
		const httpAdapter = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		if (exception instanceof PrismaClientRustPanicError) {
			httpStatus = 400;
			errorMessage = exception.message;
		} else if (exception instanceof PrismaClientValidationError) {
			httpStatus = 422;
			errorMessage = exception.message;
		} else if (exception instanceof PrismaClientKnownRequestError) {
			httpStatus = 400;
			errorMessage = exception.message;
		} else if (exception instanceof PrismaClientUnknownRequestError) {
			httpStatus = 400;
			errorMessage = exception.message;
		} else if (exception instanceof PrismaClientInitializationError) {
			httpStatus = 400;
			errorMessage = exception.message;
		} else if (
			exception.getStatus() &&
			exception.getStatus() >= 400 &&
			exception.getStatus() <= 499
		) {
			httpStatus = exception.getStatus();
			errorMessage = exception.message;
		} else {
			httpStatus = 500;
			errorMessage = [
				'Sorry! something went to wrong on our end, Please try again later',
			];
		}
		const errorResponse = {
			errors:
				typeof errorMessage === 'string' ? [errorMessage] : errorMessage,
		};
		httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
	}
}
