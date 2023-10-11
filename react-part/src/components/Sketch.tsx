import { useContext } from "react";
import Paddles from "./SketchClasses/Paddle"
import { SocketContext } from "../contexts/SocketContext";
import { coordonation } from "./SketchInterfaces/coordonation";
import { P5CanvasInstance, ReactP5Wrapper} from "react-p5-wrapper";

const GameCanvas = () => {
  const socket = useContext(SocketContext);
  let canvasTime = 'onHold';
  console.log("GameCanvas");
  const sketch = (p5 : P5CanvasInstance) => {
    let ball_coordonation: number[] = [];
    let paddles: Paddles;
    let Score : number[] = [];
    let time : number[] = []
    p5.setup = () => {  
      p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      paddles = new Paddles(p5);
    };
    
    socket.on('delay',(state : string)=>
    {
        canvasTime = state;
    })
    p5.draw = () => {
      p5.resizeCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      p5.background(0);
      if  (canvasTime == 'afterdelay')
      {
          socket.emit("drawPaddles", (coordonation: coordonation)=>
          {
            paddles.x = p5.map(coordonation.x, 0, 683, 0, (p5.windowWidth / 2));
            paddles.y = p5.map(coordonation.y, 0, 331, 0, p5.windowHeight / 2);
            paddles.w = p5.map(coordonation.w, 0, 683, 0, p5.windowWidth / 2);
            paddles.h = p5.map(coordonation.h, 0, 331, 0, p5.windowHeight / 2);
            paddles.x_1 = p5.map(coordonation.x_1, 0, 683, 0, p5.windowWidth / 2);
            paddles.y_1 = p5.map(coordonation.y_1, 0, 331, 0, p5.windowHeight / 2);
            paddles.w_1 = p5.map(coordonation.w_1, 0, 683, 0, p5.windowWidth / 2);
            paddles.h_1 = p5.map(coordonation.h_1, 0, 331, 0, p5.windowHeight / 2);
            })
            paddles.show(paddles.x, paddles.y, paddles.w, paddles.h);
            paddles.show(paddles.x_1, paddles.y_1, paddles.w_1, paddles.h_1);
            socket.emit('getballposition', (coordonation: number[])=>
            {
              ball_coordonation[0] = p5.map(coordonation[0], 0, 683, 0, p5.windowWidth / 2);
              ball_coordonation[1] = p5.map(coordonation[1], 0, 331, 0, p5.windowHeight / 2);
              ball_coordonation[2] = p5.map(24, 0, 683, 0, p5.windowWidth /2);
            });
            socket.on('gameTimer', (currentTime : number[])=>
            {
              time[0] = currentTime[0];
              time[1] = currentTime[1];
            })
            p5.ellipse(ball_coordonation[0], ball_coordonation[1], ball_coordonation[2], ball_coordonation[2]);
            socket.emit("updatePaddlePosition");
            socket.emit("getScore", (score : number[])=>
            {
              Score[0] = score[0];
              Score[1] = score[1];
            })
          }
        p5.fill(255);
        p5.textSize(32);
        p5.text(time[0] + ":" + time[1], p5.height / 2 ,p5.width / 2);
        p5.text(Score[0], 32, 40, 40);
        p5.text(Score[1], p5.windowWidth / 2 - 32, 40, 40);
    };
    p5.keyReleased = () => {
      socket.emit('stopPaddleMove');
    }
    p5.keyPressed = () => {
      console.log('key_pressed');
      if (p5.keyCode == p5.UP_ARROW)
        socket.emit('playerMovePaddle', -15);
      else if (p5.keyCode == p5.DOWN_ARROW)
        socket.emit('playerMovePaddle', 15);
    }
  }
  return (
  <div className="GameCanvas">
    <ReactP5Wrapper sketch={sketch}/>
    </div>
  );
  }

export default GameCanvas;
