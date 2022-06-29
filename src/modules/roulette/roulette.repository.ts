import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from 'src/models/entities/cache-user.model';
import { GameMode } from 'src/models/enums/game-mode.enum';

@Injectable()
export class RouletteRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public initializeSession(
    balance: number,
    userId: number,
    gameMode: GameMode,
  ) {
    const userGameEntity = new User({
      balance,
      userId,
      gameMode,
    });

    console.log('=========');
    console.log(userId);
    console.log(JSON.stringify(userGameEntity));

    return this.cacheManager.set(userId.toString(), userGameEntity);
  }

  public getGameSession(userId: number): Promise<User> {
    return this.cacheManager.get<User>(userId.toString());
  }

  public updateBalance(gameSession: User): Promise<User> {
    return this.cacheManager.set(gameSession.userId.toString(), gameSession);
  }

  public endSessions(userId: number): Promise<any> {
    return this.cacheManager.del(userId.toString());
  }
}
