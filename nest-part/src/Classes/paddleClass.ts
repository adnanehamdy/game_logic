

export class paddleClass {
    x: number;
    y: number;
    w = 10;
    h = 50;
    y_change = 0;

    constructor(width, height) {
        // if (left)
            // this.x = this.w;
        // else
            this.x = width - this.w;
        this.y = height / 2;
    }
    update = () => {
        this.y += this.y_change;
        // this.y = this.p5.constrain(this.y, this.h / 2, this.p5.height - this.h / 2)
    }
    move = (steps: number) =>
        this.y_change = steps;

    // show = () => {
    //     // this.p5.background(255);
    //     this.p5.rectMode(this.p5.CENTER);
    //     this.p5.rect(this.x, this.y, this.w, this.h);
    // }
}