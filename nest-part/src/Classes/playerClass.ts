import { paddleClass } from './paddleClass';

export class playerClass{
    paddle : paddleClass;
    socketId : string
    constructor(width: number, height:number)
    {
        this.paddle = new paddleClass(width, height);
        console.log(this.paddle.x);
    }

}