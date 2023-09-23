import { dashBoard } from 'src/Classes/dashBoard';
import { Injectable } from '@nestjs/common';
import { metaDataDTO } from 'src/DTOs/metaData.DTO';
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
@Injectable()
export class gameService {
    private dashBoard: dashBoard;

    constructor() {
        this.dashBoard = new dashBoard();
        this.dashBoard.playersNumber = 0;
    }

    isGameOpen() {
        return (this.dashBoard.playersNumber % 2);
    }
    matchPlayerFromSocketId(socket: Socket): number[] {
        let gp_index: number[] = [];
        gp_index.push(this.dashBoard.allPlayersIDs.indexOf(socket.id));
        // console.log("player found in " + gp_index[0]);
        gp_index.push(0);
        if (gp_index[0] % 2) {
            gp_index[0] -= 1;
            gp_index[1] = 1;
        }
        gp_index[0] /= 2;
        return (gp_index);
    }
    createGame(metaData: metaDataDTO, @ConnectedSocket() socket: Socket) {
        let gameInstance = new gameClass();
        let playerInstance = new playerClass(0 + 10,
            metaData.height);
        let ballInstance = new ballClass(metaData.windowHeight, metaData.windowWidth);
        gameInstance.players.push(playerInstance);
        gameInstance.players[0].socketId = socket.id;
        gameInstance.ball = ballInstance;
        gameInstance.gameType = 'default';
        gameInstance.gameStatus = 'pending'
        gameInstance.ball.score.push(0);
        gameInstance.ball.score.push(0);
        gameInstance.gameId = randomUUID();
        socket.join(gameInstance.gameId);
        this.dashBoard.games.push(gameInstance);
        this.dashBoard.playersNumber++;
        this.dashBoard.allPlayersIDs.push(socket.id);
        console.log('game created');
    }

    joinGame(metaData: metaDataDTO, socket: Socket) {
        let playerInstance = new playerClass(metaData.windowWidth - 10,
            metaData.height);
        playerInstance.socketId = socket.id;
        this.dashBoard.games[this.dashBoard.
            games.length - 1].players.push(playerInstance);
        this.dashBoard.playersNumber++;
        this.dashBoard.games[this.dashBoard.
            games.length - 1].gameStatus = 'playing';
        // console.log("player " + this.dashBoard.playersNumber +
        //     "joined the game" + (this.dashBoard.games.length - 1));
        this.dashBoard.allPlayersIDs.push(socket.id);
    }
    playerMovePaddle(newPostion: number, socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket)

        console.log("game related to player" + gp_index[0]);
        const foundsocket = this.dashBoard.games[gp_index[0]].players[gp_index[1]].socketId;
        this.dashBoard.games[gp_index[0]].players[gp_index[1]].paddle.move(newPostion);
        console.log("found socket" + foundsocket);
    }

    drawPaddles(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        let coordonation = new coordonationDTO;
        if (this.dashBoard.games[gp_index[0]].gameStatus === 'playing') {
            // console.log(gp_index);
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
        }
        // console.log(coordonation);
        return (coordonation);

    }
    updatePaddlePosition(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[gp_index[0]].
            players[gp_index[1]].paddle.update();
    }
    stopPaddleMove(socket: Socket) {
        let gp_index = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[gp_index[0]].
            players[gp_index[1]].paddle.y_change = 0;
    }
    getballposition(socket: Socket)
    {
        let ball_coordonation : number[] = [];
        let gp_index = this.matchPlayerFromSocketId(socket);
        if (this.dashBoard.games[gp_index[0]].gameStatus === 'playing')
        {
            let leftPaddle = this.dashBoard.games[gp_index[0]].players[0].paddle;
            let rightPaddle = this.dashBoard.games[gp_index[0]].players[1].paddle;
            this.dashBoard.games[gp_index[0]].ball.update();
            this.dashBoard.games[gp_index[0]].ball.checkRightPaddle(rightPaddle.x,
                rightPaddle.y, rightPaddle.h);
            this.dashBoard.games[gp_index[0]].ball.checkLeftPaddle(leftPaddle.x,
                    leftPaddle.y, leftPaddle.h); 
            this.dashBoard.games[gp_index[0]].ball.edges(490, 1062);
            ball_coordonation[0] = this.dashBoard.games[gp_index[0]].ball.x;
            ball_coordonation[1] = this.dashBoard.games[gp_index[0]].ball.y;
        }
        return (ball_coordonation);
    }
    getScore(socket: Socket)
    {
        let players_score : number[] = [];
        let game_index = this.matchPlayerFromSocketId(socket);
        players_score.push(this.dashBoard.games[game_index[0]].ball.score[0]);
        players_score.push(this.dashBoard.games[game_index[0]].ball.score[1]);
        console.log(players_score.push(this.dashBoard.games[game_index[0]].ball.score[0]));
        return (players_score);
    }
}