import { dashBoard } from 'src/Classes/dashBoard';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { playerClass } from 'src/Classes/playerClass';
import { ballClass } from 'src/Classes/ballClass';
import { gameClass } from 'src/Classes/gameClass';
import { MetadataScanner } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { ConnectedSocket } from '@nestjs/websockets';
import { match } from 'assert';
import { coordonationDTO } from 'src/DTOs/coordonation.DTO';
import { paddleClass } from 'src/Classes/paddleClass';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { botClass } from 'src/Classes/botClass';   

@Injectable()
export class gameService {
    private dashBoard: dashBoard;
    constructor() {
        this.dashBoard = new dashBoard();
        this.dashBoard.playersNumber = 0;
    }
    getGameId(socket: Socket) {
        const gp_index = this.matchPlayerFromSocketId(socket);
        return (this.dashBoard.games[gp_index[0]].gameId);
    }
    isGameOpen() {
        return (this.dashBoard.playersNumber % 2);
    }
    matchPlayerFromSocketId(socket: Socket): number[] {
        let gp_index: number[] = [];
        gp_index.push(this.dashBoard.allPlayersIDs.indexOf(socket.id));
        gp_index.push(0);
        if (gp_index[0] % 2) {
            gp_index[0] -= 1;
            gp_index[1] = 1;
        }
        gp_index[0] /= 2;
        return (gp_index);
    }
    createGame(@ConnectedSocket() socket: Socket, gameMode: string | string[]) {
        const metaData =
        {
            windowWidth: 683, windowHeight: 331,
            width: 100, height: 100
        };
        let gameInstance = new gameClass();
        let playerInstance = new playerClass(0 + 10,
            metaData.windowHeight);
        let ballInstance = new ballClass(metaData.windowHeight, metaData.windowWidth);
        gameInstance.players.push(playerInstance);
        gameInstance.players[0].socketId = socket.id;
        gameInstance.ball = ballInstance;
        gameInstance.gameMode = gameMode;
        gameInstance.gameStatus = 'Waiting'
        gameInstance.ball.score.push(0);
        gameInstance.ball.score.push(0);
        gameInstance.gameId = randomUUID();
        socket.join(gameInstance.gameId);
        this.dashBoard.games.push(gameInstance);
        this.dashBoard.playersNumber++;
        this.dashBoard.allPlayersIDs.push(socket.id);
        // console.log('Game created');
    }
    botJoinGame() {
        const metaData =
        {
            windowWidth: 683, windowHeight: 331,
            width: 100, height: 100
        };
        let playerInstance = new botClass(metaData.windowWidth - 10,
            metaData.windowHeight);
        // console.log("in bot join ")
        // playerInstance.socketId = "botMode";
        this.dashBoard.games[this.dashBoard.
            games.length - 1].players.push(playerInstance);
        this.dashBoard.games[this.dashBoard.games.length - 1].players[1].socketId = "botMode"
        this.dashBoard.games[this.dashBoard.
            games.length - 1].gameStatus = 'playing';
        return this.dashBoard.games[this.dashBoard.games.length - 1].gameId;
    }


    joinGame(socket: Socket, gameMode: string | string[]) {
        const metaData =
        {
            windowWidth: 683, windowHeight: 331,
            width: 100, height: 100
        };
        let playerInstance = new playerClass(metaData.windowWidth - 10,
            metaData.windowHeight);
        playerInstance.socketId = socket.id;
        this.dashBoard.games[this.dashBoard.
            games.length - 1].players.push(playerInstance);
        this.dashBoard.playersNumber++;
        socket.join(this.dashBoard.games[this.dashBoard.games.length - 1].gameId);
        this.dashBoard.games[this.dashBoard.
            games.length - 1].gameStatus = 'playing';
        this.dashBoard.allPlayersIDs.push(socket.id);
        return this.dashBoard.games[this.dashBoard.games.length - 1].gameId;
    }
    playerMovePaddle(newPostion: number, socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket)

        const foundsocket = this.dashBoard.games[gp_index[0]].players[gp_index[1]].socketId;
        this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.move(newPostion);
    }

    drawPaddles(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        let coordonation = new coordonationDTO;
        coordonation.x = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.x;
        coordonation.y = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.y;
        coordonation.w = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.w;
        coordonation.h = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.h;
        if (gp_index[1] === 1)
            gp_index[1] = 0;
        else
            gp_index[1] = 1;
        coordonation.x_1 = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.x;
        coordonation.y_1 = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.y;
        coordonation.w_1 = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.w;
        coordonation.h_1 = this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.h;
        return (coordonation);

    }

    updatePaddlePosition(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[gp_index[0]].
            players[gp_index[1]].paddle.update();
        setTimeout(() => {
            if (this.dashBoard.games[gp_index[0]].gameMode === 'botMode' &&  Math.random() < 0.75 && this.dashBoard.games[gp_index[0]].ball.x > 683 / 2) {
              this.dashBoard.games[gp_index[0]].players[1].paddle.move(undefined, this.dashBoard.games[gp_index[0]].ball.y);
              if (Math.random() < this.dashBoard.games[gp_index[0]].ball.bot_error_ratio)
                this.dashBoard.games[gp_index[0]].players[1].paddle.y_change = 0;
            }
          }, 0);
        if (this.dashBoard.games[gp_index[0]].gameMode === 'botMode')
        this.dashBoard.games[gp_index[0]].players[1].paddle.
        update();
        // if (Math.random() < 0.25)
        if (this.dashBoard.games[gp_index[0]].gameMode === 'botMode')
            this.dashBoard.games[gp_index[0]].players[1].paddle.y_change = 0;
    }
    stopPaddleMove(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[gp_index[0]].
            players[gp_index[1]].paddle.y_change = 0;
        
    }
    getballposition(socket: Socket) {
        let ball_coordonation: number[] = [];
        let gp_index = this.matchPlayerFromSocketId(socket);
        let leftPaddle = this.dashBoard.games[gp_index[0]].players[0].paddle;
        let rightPaddle = this.dashBoard.games[gp_index[0]].players[1].paddle;
        // if (this.dashBoard.games[gp_index[0]].gameMode === 'botMode')
        //     this.dashBoard.games[gp_index[0]].ball.update('botMode');
        // else
        this.dashBoard.games[gp_index[0]].ball.update();
        this.dashBoard.games[gp_index[0]].ball.checkRightPaddle(rightPaddle.x,
            rightPaddle.y, rightPaddle.h);
        this.dashBoard.games[gp_index[0]].ball.checkLeftPaddle(leftPaddle.x,
            leftPaddle.y, leftPaddle.h);
            if (this.dashBoard.games[gp_index[0]].gameMode === 'botMode')
            this.dashBoard.games[gp_index[0]].ball.edges(490, 1062, 1);
            else
                this.dashBoard.games[gp_index[0]].ball.edges(490, 1062);
            
        ball_coordonation[0] = this.dashBoard.games[gp_index[0]].ball.x;
        ball_coordonation[1] = this.dashBoard.games[gp_index[0]].ball.y;
        // bot call
        return (ball_coordonation);
    }
    getScore(socket: Socket) {
        let players_score: number[] = [];
        let game_index = this.matchPlayerFromSocketId(socket);
        players_score.push(this.dashBoard.games[game_index[0]].ball.score[0]);
        players_score.push(this.dashBoard.games[game_index[0]].ball.score[1]);
        return (players_score);
    }
    getPlayersId(socket: Socket) {
        const players_id: string[] = [];
        const gp_index = this.matchPlayerFromSocketId(socket);

        players_id.push(this.dashBoard.games[gp_index[0]].players[0].socketId);
        players_id.push(this.dashBoard.games[gp_index[0]].players[1].socketId);
        return players_id;
    }
}