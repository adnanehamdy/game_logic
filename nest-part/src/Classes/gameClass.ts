import { ballClass } from './ballClass';
import {playerClass } from './playerClass';

export class gameClass{
    gameId: string;
    gameStatus: string;
    ball : ballClass;
    players : playerClass[] = [];
    score: number[] = [];
    gameType: string;

    constructor()
    {}


}

