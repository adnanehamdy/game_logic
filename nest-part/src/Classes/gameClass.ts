import {playerClass } from './playerClass';

export class gameClass{
    gameId: string;
    gameStatus: string;
    players : playerClass[] = [];
    score: number[] = [];
    gameType: string;

    constructor()
    {}


}

