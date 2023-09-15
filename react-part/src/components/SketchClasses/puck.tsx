import p5 from "p5";

class puck {
  p5 : p5;
  x: number;
  y: number;
  xspeed = 2;
  yspeed = 0.5;
  constructor(p5: p5) {

    this.p5 = p5;
    this.y = p5.height /2;
    this.x = p5.width / 2;
  }
  // update() {
  //   this.x = this.x + this.xspeed;
  //   this.y = this.y + this.yspeed;
  // }
  Show(x: number, y: number) {
    this.p5.ellipse(x, y, 24, 24);
  }
//   reset = () =>
//   {
//     this.x = this.p5.width /2;
//     this.y = this.p5.height / 2;
//     this.yspeed = this.yspeed * -1;
//     this.xspeed = this.xspeed * -1;
//   }

//   edges() {
//     if (this.y < 0 || this.y > this.p5.windowHeight / 2) {
//       this.yspeed = this.yspeed * -1;
//     }
//     if (this.x > this.p5.width)
//       this.reset();
//     if (this.x < 0)
//       this.reset();
//   }


}

export default puck;

