import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { gameService  } from './game.service';
import { UUID, randomUUID } from 'crypto';
import { metaDataDTO } from 'src/DTOs/metaDataDto';

@WebSocketGateway(
  {
    cors: {
      origin: ['http://localhost:5173'],
    },
  }
)
export class GameGateway  {
  @WebSocketServer()
  io: Server;

  constructor(private readonly gameService: gameService)
  {}
  @SubscribeMessage('join a game')
  newPlayerJoined(@MessageBody() metaData: metaDataDTO, socket: Socket) {
    if (this.gameService.isGameOpen())
    {
      this.gameService.joinGame(socket.id);
      return 'connected to a game';
    }
    this.gameService.createGame(metaData, socket);
    return 'new game created';
  }

  onModuleInit() {
    this.io.on('connection', (socket) => {
    });
  }
}
