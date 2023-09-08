
export class ballClass {
    x: number;
    y: number;
    height: number;
    width: number;
    xspeed = 2;
    yspeed = 0.5;
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.y = this.height /2;
        this.x = this.width / 2;
    }
    update() {
      this.x = this.x + this.xspeed;
      this.y = this.y + this.yspeed;
    }
    // Show() {
    //   this.p5.ellipse(this.x, this.y, 24, 24);
    // }
    reset = () =>
    {
      this.x = this.width /2;
      this.y = this.height / 2;
      this.yspeed = this.yspeed * -1;
      this.xspeed = this.xspeed * -1;
    }
  
    edges(windowHeight: number) {
      if (this.y < 0 || this.y > windowHeight / 2) {
        this.yspeed = this.yspeed * -1;
      }
      if (this.x > this.width)
        this.reset();
      if (this.x < 0)
        this.reset();
    }
  }