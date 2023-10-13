import { Injectable, OnModuleInit } from '@nestjs/common';
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
@Injectable()
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
    // console.log(thi)
    if (this.gameService.gameloaded(socket))
    {
      console.log("------------------ > game out" + socket.id);
      const gameId = this.gameService.getGameId(socket)
      const res = this.gameService.getGameResult(socket)
      console.log("res = " + this.gameService.getGameResult(socket));

      // console.log("res = " + res)
      if (res[0] === 'default')
      {
        res[0] = 'false'
        res[1] = 'victory';
        console.log("dkhel");
        // console.log("dkhel")
      }
      this.io.to(gameId).emit('delay', res);
      //   console.log("kahwya")
      this.io.to(gameId).emit("disconnectAll")
      // this.io.to(gameId).emit("Game  result");
      this.gameService.stopInterval(socket);
      this.gameService.removeGame(socket)
      // this.io.emit("disconnectAll");
      console.log("socket " + socket.id)
    }
  }

  
  handleConnection(@ConnectedSocket() socket: Socket)
  {
    let gameMode = socket.handshake.query.gameMode;
    let gameduration = socket.handshake.query.gameDuration;
    
    this.logger.log(`Client connected: ${socket.id}`);
    if (this.gameService.isGameOpen(parseInt(gameduration.toString(), 10)))
    {
      const gameId = this.gameService.joinGame(socket, gameMode, parseInt(gameduration.toString(), 10))
      this.io.to(gameId).emit("GameStarted");
      setTimeout(() => {
        // socket.on("TimeIsUp", () =>
        // {
        //   this.handleDisconnect(socket);
        // })
        let result : string[] = [];
        result[0] = 'true';
        result[1] = undefined;
        this.io.to(gameId).emit('delay', result);
        this.gameService.gameTimer(socket, new Date().getTime());
      }, 1000)
      return ;
    }

    this.gameService.createGame(socket, gameMode, gameduration);
    console.log(gameMode);
    if (gameMode === 'botMode')
    {
      // socket.disconnect();
      this.gameService.botJoinGame(parseInt(gameduration.toString(), 10))
      const gameId = this.gameService.getGameId(socket)
      this.io.to(gameId).emit("GameStarted")
      setTimeout(() => {
        this.io.to(gameId).emit('delay', 'afterdelay')
        this.gameService.gameTimer(socket,1)
        this.intervalId = setInterval(()=>
        {
          this.gameService.updateballposition(socket);
          this.gameService.gameTimer(socket)
        }
        , 16)
      }, 1000)
    }
    return 'new game cretead';
  }

    // @SubscribeMessage('timeIsUp')
    // timeIsUp(socket : Socket)
    // {
    //   console.log("-------------------------> timeup");
    //   this.handleDisconnect(socket);
    // }

  @SubscribeMessage('playerMovePaddle')
  playerMovePaddle(@MessageBody() newPosition :number, @ConnectedSocket() socket: Socket)
  {
    console.log("socket.id before search =" + socket.id)
    this.gameService.playerMovePaddle(newPosition, socket)
  }
  @SubscribeMessage("drawPaddles")
  draw(@ConnectedSocket() socket: Socket)
  {
    return (this.gameService.drawPaddles(socket))
  }
  @SubscribeMessage("updatePaddlePosition")
  updatePaddlePosition(@ConnectedSocket() socket: Socket)
  {
    this.gameService.updatePaddlePosition(socket)
  }
  @SubscribeMessage("stopPaddleMove")
  stopPaddleMove(@ConnectedSocket() socket: Socket)
  {
    this.gameService.stopPaddleMove(socket)
  }

  @SubscribeMessage("getballposition")
  getballposition(@ConnectedSocket() socket: Socket)
  {
    console.log("------> lmashakil" + socket.id);
    const PlayersId = this.gameService.getPlayersId(socket)
    return (this.gameService.getballposition(socket))
  }
  
  @SubscribeMessage("getScore")
  getScore(@ConnectedSocket() socket: Socket)
  {
    const gameId = this.gameService.getGameId(socket)
    this.io.to(gameId).emit('gameTimer', this.gameService.getTime(socket));
    const Score = this.gameService.getScore(socket)
    return Score;
  }
  }
