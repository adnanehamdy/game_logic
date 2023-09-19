
export class ballClass {
  x: number;
  y: number;
  height: number;
  width: number;
  xspeed = 5;
  yspeed = 1  ;
  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.y = this.height / 2;
    this.x = this.width / 2;
  }
  update() {
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
  }
  checkLeftPaddle(paddle_x: number, paddle_y: number, paddle_h: number) {
    if ((this.y < (paddle_y + paddle_h / 2) &&
      this.y > (paddle_y - paddle_h / 2)) && this.x - 12 < paddle_x + 5)
          this.xspeed *= -1;
    }
    checkRightPaddle(paddle_x: number, paddle_y: number, paddle_h: number) {
      if ((this.y < (paddle_y + paddle_h / 2) &&
        this.y > (paddle_y - paddle_h / 2)) && this.x + 12 > paddle_x - 5)
            this.xspeed *= -1;
      }
  reset = () => {
    this.x = this.width / 2;
    this.y = this.height / 2;
    this.yspeed = this.yspeed * -1;
    this.xspeed = this.xspeed * -1;
  }

  edges(windowHeight: number, windowWidth: number) {
    if (this.y < 0 + 12 || this.y > windowHeight - 12) {
      this.yspeed  = this.yspeed * -1;
    }
    if (this.x > windowWidth)
      this.reset();
    if (this.x < 0)
      this.reset();
  }
}