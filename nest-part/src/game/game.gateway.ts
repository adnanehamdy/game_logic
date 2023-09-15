import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { gameService  } from './game.service';
import { UUID, randomUUID } from 'crypto';
import { metaDataDTO } from 'src/DTOs/metaData.DTO';
import { MetadataScanner } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import {metaData } from '../interfaces/metaData';
import { subscribe } from 'diagnostics_channel';
import { Logger } from '@nestjs/common';
import { OnGatewayDisconnect } from '@nestjs/websockets';
@WebSocketGateway(
  {
    cors: {
      origin: ['http://localhost:5173'],
    },
  }
)
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger(GameGateway.name);
  constructor(private readonly gameService: gameService)
  {}

  @SubscribeMessage('join a game')
  newPlayerJoined(@MessageBody() Data: metaData, @ConnectedSocket() socket: Socket) {
  const metaData = plainToClass(metaDataDTO, Data.metadata);
    if (this.gameService.isGameOpen())
    {
      this.gameService.joinGame(metaData, socket);
      return 'connected to a game';
    }

    this.gameService.createGame(metaData, socket);
    return 'new game created';
  }

  handleDisconnect(socket: Socket) {
    
    this.logger.log(`Cliend id:${socket.id} disconnected`);

  }

  onModuleInit() {
    this.io.on('connection', (socket) => {
    });
  }
  @SubscribeMessage('playerMovePaddle')
  playerMovePaddle(@MessageBody() newPosition :number, @ConnectedSocket() socket: Socket)
  {
    console.log("socket.id before search =" + socket.id);
    this.gameService.playerMovePaddle(newPosition, socket);
  }
  @SubscribeMessage("draw paddle")
  drawPaddle(@ConnectedSocket() socket: Socket)
  {
    return (this.gameService.drawPaddle(socket));
  }
  @SubscribeMessage("updatePaddlePosition")
  updatePaddlePosition(@ConnectedSocket() socket: Socket)
  {
    this.gameService.updatePaddlePosition(socket);
  }
  @SubscribeMessage("stopPaddleMove")
  stopPaddleMove(@ConnectedSocket() socket: Socket)
  {
    this.gameService.stopPaddleMove(socket);
  }
}
