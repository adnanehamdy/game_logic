import { paddleClass } from './paddleClass';

export class playerClass{
    paddle : paddleClass;
    constructor(width: number, height:number)
    {
        this.paddle = new paddleClass(width, height);
    }

}