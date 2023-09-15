// import React from 'react';
import { useContext, useEffect } from "react";
import p5 from "p5";
// import puck from "./SketchClasses/puck";
import Paddles from "./SketchClasses/Paddle"
import { SocketContext } from "../contexts/SocketContext";
import { coordonation } from "./SketchInterfaces/coordonation";
import { metaData } from "./SketchInterfaces/metaData";

const Sketch = () => {
  const socket = useContext(SocketContext);
  const p = (p5: p5) => {  
    let ball_coordonation: number[] = [];
    let paddles: Paddles;
    p5.setup = () => {
      // i should map the backend values
      // into the front values and not send the data from the react
      let metadata : metaData = 
      { windowWidth : p5.windowWidth / 2, windowHeight : p5.windowHeight / 2, 
        width : p5.width, height : p5.height};
        console.log(metadata);
      socket.emit('join a game',{metadata} ,(data: string) =>
      {
        console.log(data);
      });
      p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      paddles = new Paddles(p5);
    };
    
    p5.draw = () => {
      p5.background(0);
      socket.emit("drawPaddles", (coordonation: coordonation)=>
      {
        paddles.x = coordonation.x;
        paddles.y = coordonation.y;
        paddles.w = coordonation.w;
        paddles.h = coordonation.h;
        paddles.x_1 = coordonation.x_1;
        paddles.y_1 = coordonation.y_1;
        paddles.w_1 = coordonation.w_1;
        paddles.h_1 = coordonation.h_1;
        })
        paddles.show(paddles.x, paddles.y, paddles.w, paddles.h);
        paddles.show(paddles.x_1, paddles.y_1, paddles.w_1, paddles.h_1);
        socket.emit('getballposition', (coordonation: number[])=>
        {
          ball_coordonation[0] = coordonation[0];
          ball_coordonation[1] = coordonation[1];
        });
        p5.ellipse(ball_coordonation[0], ball_coordonation[1], 24, 24);
        socket.emit("updatePaddlePosition");
      // left.show();
      // right.show();
      // left.update();
      // right.update();
      // ball.update();
      // ball.Show();
      // ball.edges();
    };
    p5.keyReleased = () => {
      socket.emit('stopPaddleMove');
      // ball.Show();
      // left.move(0);
      // right.move(0);
    }
    p5.keyPressed = () => {
      console.log('key_pressed');
      if (p5.key == 'w')
        socket.emit('playerMovePaddle', -15);
      else if (p5.key == 's')
        socket.emit('playerMovePaddle', 15);
  }
};

useEffect(() => {
  const p5Object = new p5(p);
  return p5Object.remove;
}, []);

  return <></>;
};

export default Sketch;
