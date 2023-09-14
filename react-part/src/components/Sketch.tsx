// import React from 'react';
import { useContext, useEffect } from "react";
import p5 from "p5";
import ball from "./SketchClasses/ball";
import Paddle from "./SketchClasses/Paddle"
import { SocketContext } from "../contexts/SocketContext";
import { coordonation } from "./SketchInterfaces/coordonation";
import { metaData } from "./SketchInterfaces/metaData";

const Sketch = () => {
  const socket = useContext(SocketContext);
  const p = (p5: p5) => {  
    // let ball: ball;
    let paddle: Paddle;
    p5.setup = () => {
      // i should map the backend values
      // into the front values and not send the data from the react
      let metadata : metaData = 
      { windowWidth : p5.windowWidth, windowHeight : p5.windowHeight, 
        width : p5.width, height : p5.height};
        console.log(metadata);
      socket.emit('join a game',{metadata} ,(data: string) =>
      {
        console.log(data);
      });
      p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      paddle = new Paddle(p5);
      // ball = new ball(p5);
    };
    
    p5.draw = () => {
      p5.background(200);
      socket.emit("draw paddle", (coordonation: coordonation)=>
      {
        paddle.x = coordonation.x;
        paddle.y = coordonation.y;
        paddle.w = coordonation.w;
        paddle.h = coordonation.h;
          console.log("draw paddle");
      })
      paddle.show();
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
