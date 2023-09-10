import { dashBoard } from 'src/Classes/dashboard';
import { Injectable } from '@nestjs/common';
import { metaDataDTO } from 'src/DTOs/metaDataDto';
import { Socket} from 'socket.io';
import { playerClass } from 'src/Classes/playerClass';
import { gameClass } from 'src/Classes/gameClass';
import { MetadataScanner } from '@nestjs/core';
@Injectable()
export class gameService {
    private dashBoard: dashBoard;

    isGameOpen() {
        return (this.dashBoard.players % 2);
    }
    createGame(metaData: metaDataDTO, socket: Socket)
    {
       let gameInstance : gameClass;
        // gameInstance.players[0] = socket.id;
        gameInstance.players[0] =  new playerClass(metaData.width, metaData.height);
        gameInstance.gameType = 'default';
        gameInstance.score[0] = 0;
        gameInstance.score[1] = 1;
        gameInstance.gameId = 
    }

}