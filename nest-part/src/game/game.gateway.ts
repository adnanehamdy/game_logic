import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { gameService  } from './game.service';
import { randomUUID } from 'crypto';
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
    const PlayersId = this.gameService.getPlayersId(socket);
    this.io.to(gameId).emit("Game result");
  }

  handleConnection(@ConnectedSocket() socket: Socket)
  {
    // console.log("query");
    // console.log(socket.handshake.query.message);
    let gameMode = socket.handshake.query.message;
    this.logger.log(`Client connected: ${socket.id}`);
    if (this.gameService.isGameOpen())
    {
      const gameId = this.gameService.joinGame(socket, gameMode);
      this.io.to(gameId).emit("GameStarted");
    }
    this.gameService.createGame(socket, gameMode);
    console.log(gameMode);
    if (gameMode === 'botMode')
    {
      console.log("the game is in bot mode");
      this.gameService.botJoinGame()
      const gameId = this.gameService.getGameId(socket);
      this.io.to(gameId).emit("GameStarted");
    }
    // console.log("reload")
    return 'new game cretead';
  }

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
    const PlayersId = this.gameService.getPlayersId(socket);
    if (PlayersId[0] === socket.id)
      this.gameService.updateballposition(socket);
    return (this.gameService.getballposition(socket));
  }
  
  @SubscribeMessage("getScore")
  getScore(@ConnectedSocket() socket: Socket)
  {
    const Score = this.gameService.getScore(socket);
    const gameId = this.gameService.getGameId(socket);
    const PlayersId = this.gameService.getPlayersId(socket);
    if (Score[0] == 3)
    {
      this.io.to(gameId).emit("Game result", (PlayersId[0]));
      console.log("end");
    }
    else if (Score[1] == 3)
    {
      this.io.to(gameId).emit("Game result", (PlayersId[1]));
      console.log("end");
    }
    return Score;
  }
  }
