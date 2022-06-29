import * as redisStore from 'cache-manager-redis-store';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RouletteModule } from './roulette/roulette.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CacheModule, Module, ValidationPipe } from '@nestjs/common';
import { JwtHelper } from 'src/commons/jwt-helper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    RouletteModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
      ttl: 0,
    }),
  ],
  controllers: [],
  providers: [
    JwtHelper,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
