import { NestFactory } from '@nestjs/core';
import { Logger, LogLevel } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';

import { startAsClusterMode } from './cluster';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './app/middlewares/exception.filter';
import { ValidationPipe } from './app/middlewares/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // logger level
  const loggerLevels = configService.get<LogLevel[]>('LOGGER_LEVEL');
  app.useLogger(loggerLevels);

  // swagger
  if (configService.get('NODE_ENV') == 'dev') {
    const config = new DocumentBuilder()
      .setTitle("Pascal Lin's Netsjs Template")
      .setDescription('The CSP platform API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http' }, 'jwt')
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

if (process.env.CLUSTER_MODE.toUpperCase() === 'TRUE') {
  startAsClusterMode(bootstrap);
} else {
  bootstrap();
}
