import { randomInt } from "crypto";
export class ballClass {
  x: number;
  y: number;
  height: number;
  width: number;
  score: number[] = [];
  xspeed = 5;
  yspeed = 1  ;
  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.reset();
  }
  update() {
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
  }
  checkLeftPaddle(paddle_x: number, paddle_y: number, paddle_h: number) {
    if ((this.y < (paddle_y + paddle_h / 2) &&
      this.y > (paddle_y - paddle_h / 2)) && this.x - 12 < paddle_x + 5)
        if (this.x > paddle_x)
        {
          const diff = this.y - (paddle_y - paddle_h / 2);
          const rad = 45 * (Math.PI/180);
          const angel = -rad + (rad - (-1 * rad) * ((diff - 0) / (paddle_h - 0)));
          this.xspeed = 5 * Math.cos(angel);
          this.yspeed = 5 * Math.sin(angel);
          this.x = paddle_x + 5 + 12;
          // start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
            // this.xspeed *= -1; 
        }
    }
    checkRightPaddle(paddle_x: number, paddle_y: number, paddle_h: number) {
      if ((this.y < (paddle_y + paddle_h / 2) &&
        this.y > (paddle_y - paddle_h / 2)) && this.x + 12 > paddle_x - 5)
        if (this.x < paddle_x)    
        {
          const diff = this.y - (paddle_y - paddle_h / 2);
          // const rad = 135 * (Math.PI/180);
          const rad_255 = 255 * (Math.PI/180);
          const rad_135 = 135 * (Math.PI/180);
          const angel = rad_255 + (rad_135 - rad_255) * ((diff - 0) / (paddle_h - 0));
          this.xspeed = 5 * Math.cos(angel);
          this.yspeed = 5 * Math.sin(angel);
          this.x = paddle_x - 5 - 12;
          // start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
            // this.xspeed *= -1;
        }
      }
  reset = () => {
    this.x = this.width / 2;
    this.y = this.height / 2;
    const angel =  Math.floor(Math.random() * ((Math.PI / 4)  - (-1 * Math.PI /4) + 1)) + (-1 * Math.PI /4);
    this.xspeed = 5 * Math.cos(angel);
    this.yspeed = 5 * Math.sin(angel);
    if (Math.floor(Math.random() * 1) < 0.5)
      this.xspeed *= -1;
  }

  edges(windowHeight: number, windowWidth: number) {
    if (this.y <= 0 + 12 || this.y >= this.height - 12)
      this.yspeed  = this.yspeed * -1;
    if (this.x - 10 >= this.width)
    {
      this.reset();
      this.score[0] += 1;
    }
    if (this.x + 10 <= 0)
    {
      this.reset();
      this.score[1] += 1;
    }
  }
}