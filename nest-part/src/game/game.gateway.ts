import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { gameService  } from './game.service';
import { randomUUID } from 'crypto';
// import { metaDataDTO } from 'src/DTOs/metaData.DTO';
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

  handleDisconnect(socket: Socket) {
    
    this.logger.log(`Cliend id:${socket.id} disconnected`);
    const gameId = this.gameService.getGameId(socket);
    this.io.to(gameId).emit("You Won (other client disconected)");

  }
  handleConnection(socket: Socket)
  {
    this.logger.log(`Client connected: ${socket.id}`);
    if (this.gameService.isGameOpen())
    {
      const gameId = this.gameService.joinGame(socket);
      this.io.to(gameId).emit("GameStarted");
      console.log("gamestarted event");
      return 'connected to a game';
    }
    this.gameService.createGame(socket);
    return 'new game created';
  }

  // onModuleInit() {
  //   this.io.on('connection', (socket) => {

  //   });
  // }
  @SubscribeMessage('playerMovePaddle')
  playerMovePaddle(@MessageBody() newPosition :number, @ConnectedSocket() socket: Socket)
  {
    console.log("socket.id before search =" + socket.id);
    this.gameService.playerMovePaddle(newPosition, socket);
  }
  @SubscribeMessage("drawPaddles")
  draw(@ConnectedSocket() socket: Socket)
  {
    return (this.gameService.drawPaddles(socket));
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
  @SubscribeMessage("getballposition")
  getballposition(@ConnectedSocket() socket: Socket)
  {
    return (this.gameService.getballposition(socket));
  }
  
  @SubscribeMessage("getScore")
  getScore(@ConnectedSocket() socket: Socket)
  {
    return (this.gameService.getScore(socket));
  }
}
