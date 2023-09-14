
export class paddleClass {
    x: number;
    y: number;
    w = 10;
    h = 50;
    y_change = 0;
    height: number;

    constructor(width: number, height: number) {
        this.x = width;
        this.y = height / 2;
        this.height = height;
    }
    update = () => {
        this.y += this.y_change;
        if (this.y < this.h /2)
            this.y = this.h/2;
        else if ((this.height - this.h /2) < this.y)
            this.y = this.height - this.h /2;
        // this.y = this.p5.constrain(this.y, this.h / 2, this.p5.height - this.h / 2)
        // this.y_change = 0;
    }
    move = (steps: number) =>
        this.y_change = steps;

    // show = () => {
    //     // this.p5.background(255);
    //     this.p5.rectMode(this.p5.CENTER);
    //     this.p5.rect(this.x, this.y, this.w, this.h);
    // }
}