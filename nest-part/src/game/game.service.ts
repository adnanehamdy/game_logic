import { dashBoard } from 'src/Classes/dashboard';
import { Injectable } from '@nestjs/common';
import { metaDataDTO } from 'src/DTOs/metaDataDto';
import { Socket } from 'socket.io';
import { playerClass } from 'src/Classes/playerClass';
import { gameClass } from 'src/Classes/gameClass';
import { MetadataScanner } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { ConnectedSocket } from '@nestjs/websockets';
@Injectable()
export class gameService {
    private dashBoard: dashBoard;

    constructor() { this.dashBoard = new dashBoard();
    this.dashBoard.playersNumber = 0; }

    isGameOpen() {
        console.log(this.dashBoard.playersNumber);
        return (this.dashBoard.playersNumber % 2);
    }
    createGame(metaData: metaDataDTO, @ConnectedSocket() socket: Socket) {
        let gameInstance = new gameClass();
        let playerInstance = new playerClass(metaData.width,
            metaData.height);
        console.log(playerInstance.paddle.x);
        gameInstance.players.push(playerInstance);
        gameInstance.players[0].socketId = socket.id;
        gameInstance.gameType = 'default';
        gameInstance.score.push(0);
        gameInstance.score.push(1);
        gameInstance.gameId = randomUUID();
        socket.join(gameInstance.gameId);
        this.dashBoard.games.push(gameInstance);
        this.dashBoard.playersNumber++;
        console.log('createGame');
    }

    joinGame(metaData: metaDataDTO, @ConnectedSocket() socket: Socket) {
        let playerInstance = new playerClass(metaData.width - 10,
            metaData.height);
        playerInstance.socketId = socket.id;
        this.dashBoard.games[this.dashBoard.
            games.length - 1].players.push(playerInstance);
    }
}