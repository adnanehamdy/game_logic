import { GameGateway } from './game.gateway';
import { Module, Provider } from '@nestjs/common';

@Module(
{
    providers: [GameGateway],
}
)
export class GameModule {

}