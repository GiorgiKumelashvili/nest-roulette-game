import { NestFactory } from '@nestjs/core';
import { environment } from './enviroment';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  await app.listen(environment.port);
}
bootstrap();
