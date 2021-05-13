import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './middlewares/exception.filter';
import { ValidationPipe } from './middlewares/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // swagger
  if (configService.get('NODE_ENV') == 'development') {
    const config = new DocumentBuilder()
      .setTitle('CSP platform')
      .setDescription('The CSP platform API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http' }, 'admin')
      .addBearerAuth({ type: 'http' }, 'member')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // http server setting
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.use(helmet());
  app.enableCors({ origin: ['localhost'] });

  await app.listen(configService.get('PORT'));

  new Logger('App').log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
