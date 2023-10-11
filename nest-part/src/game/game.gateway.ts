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
  private intervalId: NodeJS.Timeout;

  private readonly logger = new Logger(GameGateway.name);
  // private   initalTime : number;
  constructor(private readonly gameService: gameService)
  {}
  
  handleDisconnect(socket: Socket) {
    this.logger.log(`Cliend id:${socket.id} disconnected`);
    const gameId = this.gameService.getGameId(socket);
    this.io.to(gameId).emit("Game result");
    this.gameService.stopInterval(socket);
    this.gameService.removeGame(socket);
    console.log("socket " + socket.id);
    this.io.to(gameId).emit("disconnectAll");
  }

  handleConnection(@ConnectedSocket() socket: Socket)
  {
    let gameMode = socket.handshake.query.gameMode;
    let gamedutation = socket.handshake.query.gameDuration;
    
    this.logger.log(`Client connected: ${socket.id}`);
    if (this.gameService.isGameOpen())
    {
      const gameId = this.gameService.joinGame(socket, gameMode);
      this.io.to(gameId).emit("GameStarted");
      setTimeout(() => {
        this.io.to(gameId).emit('delay', 'afterdelay');
        this.gameService.gameTimer(socket, new Date().getTime());
        // console.log(this.gameService.getTime(socket));
        // this.gameService.startInterval(socket);
      }, 1000);
      return ;
    }
    this.gameService.createGame(socket, gameMode, gamedutation);
    console.log(gameMode);
    if (gameMode === 'botMode')
    {
      this.gameService.botJoinGame()
      const gameId = this.gameService.getGameId(socket);
      this.io.to(gameId).emit("GameStarted");
      setTimeout(() => {
        this.io.to(gameId).emit('delay', 'afterdelay');
        // this.initalTime = new Date().getTime();
        this.gameService.gameTimer(socket, 1);
        // console.log(new Date().getTime());
        // console.log( this.gameService.gameTimer(socket, new Date().getTime()));
        this.intervalId = setInterval(()=>
        {
          this.gameService.updateballposition(socket);
          this.gameService.gameTimer(socket);
        }
        , 16)
      }, 1000);
    }
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
    return (this.gameService.getballposition(socket));
  }
  
  @SubscribeMessage("getScore")
  getScore(@ConnectedSocket() socket: Socket)
  {
    const gameId = this.gameService.getGameId(socket);
    this.io.to(gameId).emit('gameTimer', this.gameService.getTime(socket))
    const Score = this.gameService.getScore(socket);
    // const gameId = this.gameService.getGameId(socket);
    // const PlayersId = this.gameService.getPlayersId(socket);
    // if (Score[0] == 3)
    // {
    //   // this.io.to(gameId).emit("Game result", (PlayersId[0]));
    //   console.log("end");
    // }
    // else if (Score[1] == 3)
    // {
    //   // this.io.to(gameId).emit("Game result", (PlayersId[1]));
    //   console.log("end");
    // }
    return Score;
  }
  }
