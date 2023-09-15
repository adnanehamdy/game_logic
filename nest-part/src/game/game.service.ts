import { dashBoard } from 'src/Classes/dashBoard';
import { Injectable } from '@nestjs/common';
import { metaDataDTO } from 'src/DTOs/metaData.DTO';
import { Socket } from 'socket.io';
import { playerClass } from 'src/Classes/playerClass';
import { gameClass } from 'src/Classes/gameClass';
import { MetadataScanner } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { ConnectedSocket } from '@nestjs/websockets';
import { match } from 'assert';
import { coordonationDTO } from 'src/DTOs/coordonation.DTO';
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
        let game_and_player: number[] = [];
        game_and_player.push(this.dashBoard.allPlayersIDs.indexOf(socket.id));
        // console.log("player found in " + game_and_player[0]);
        game_and_player.push(0);
        if (game_and_player[0] % 2) {
            game_and_player[0] -= 1;
            game_and_player[1] = 1;
        }
        game_and_player[0] /= 2;
        return (game_and_player);
    }
    createGame(metaData: metaDataDTO, @ConnectedSocket() socket: Socket) {
        let gameInstance = new gameClass();
        let playerInstance = new playerClass(0 + 10,
            metaData.height);
        gameInstance.players.push(playerInstance);
        gameInstance.players[0].socketId = socket.id;
        gameInstance.gameType = 'default';
        gameInstance.gameStatus = 'pending'
        gameInstance.score.push(0);
        gameInstance.score.push(1);
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
        let game_and_player = this.matchPlayerFromSocketId(socket)

        console.log("game related to player" + game_and_player[0]);
        const foundsocket = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].socketId;
        this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.move(newPostion);
        console.log("found socket" + foundsocket);
    }

    drawPaddle(socket: Socket) {
        let game_and_player = this.matchPlayerFromSocketId(socket);
        let coordonation = new coordonationDTO;
        if (this.dashBoard.games[game_and_player[0]].gameStatus === 'playing') {
            console.log(game_and_player);
            coordonation.x = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.x;
            coordonation.y = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.y;
            coordonation.w = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.w;
            coordonation.h = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.h;
            if (game_and_player[1] === 1)
                game_and_player[1] = 0;
            else
                game_and_player[1] = 1;
            coordonation.x_1 = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.x;
            coordonation.y_1 = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.y;
            coordonation.w_1 = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.w;
            coordonation.h_1 = this.dashBoard.games[game_and_player[0]].players[game_and_player[1]].paddle.h;
        }
        // console.log(coordonation);
        return (coordonation);

    }
    updatePaddlePosition(socket: Socket) {
        let game_and_player = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[game_and_player[0]].
            players[game_and_player[1]].paddle.update();
    }
    stopPaddleMove(socket: Socket) {
        let game_and_player = this.matchPlayerFromSocketId(socket);
        this.dashBoard.games[game_and_player[0]].
            players[game_and_player[1]].paddle.y_change = 0;
    }
}