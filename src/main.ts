import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Biazoka Store')
		.setDescription('A documentação em português da API da Loja da Biazoka')
		.setVersion('0.1')
		.addBearerAuth({
			scheme: 'bearer',
			type: 'http',
			in: 'header',
			bearerFormat: 'JWT',
		})
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(
		new PrismaClientExceptionFilter(httpAdapter, {
			P2000: HttpStatus.BAD_REQUEST,
			P2002: HttpStatus.CONFLICT,
			P2025: HttpStatus.NOT_FOUND,
		}),
	);

	app.enableCors()
	await app.listen(process.env.SERVER_PORT || 3333);
}
bootstrap();
