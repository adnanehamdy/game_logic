import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { gameService  } from './game.service';
import { UUID, randomUUID } from 'crypto';
import { metaDataDTO } from 'src/DTOs/metaDataDto';
import { MetadataScanner } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import {metaData } from '../interfaces/metaData';

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
  newPlayerJoined(@MessageBody() Data: metaData, @ConnectedSocket() socket: Socket) {
  console.log(typeof Data);
  const metaData = plainToClass(metaDataDTO, Data.metadata);
    if (this.gameService.isGameOpen())
    {
      this.gameService.joinGame(metaData, socket);
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
