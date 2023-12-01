import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'utils/HttpExceptionFilter';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	//exception-filter
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

	const config = new DocumentBuilder()
		.setTitle('Biazoka Store')
		.setDescription('A documentação em português da API da Loja da Biazoka')
		.setVersion('0.1')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.SERVER_PORT || 3333);
}
bootstrap();
