// import React from 'react';
import { useContext } from "react";
// import puck from "./SketchClasses/puck";
import Paddles from "./SketchClasses/Paddle"
import { SocketContext } from "../contexts/SocketContext";
import { coordonation } from "./SketchInterfaces/coordonation";
import { metaData } from "./SketchInterfaces/metaData";
// import { P5CanvasInstance } from "react-p5-wrapper";
import { Socket } from "socket.io-client";
import { P5CanvasInstance, ReactP5Wrapper, Sketch, SketchProps } from "react-p5-wrapper";
;



const GameCanvas = () => {
  const socket = useContext(SocketContext);
  const sketch = (p5 : P5CanvasInstance) => {
    let ball_coordonation: number[] = [];
    let paddles: Paddles;
    // let socket: Socket;
  
    let Score : number[] = [];
    p5.setup = () => {  
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
        socket.emit("getScore", (score : number[])=>
        {
          Score[0] = score[0];
          Score[1] = score[1];
        })
        p5.fill(255);
        p5.textSize(32);
        p5.text(Score[0], 32, 40, 40);
        p5.text(Score[1], p5.windowWidth / 2 - 32, 40, 40);
    };
    p5.keyReleased = () => {
      socket.emit('stopPaddleMove');
    }
    p5.keyPressed = () => {
      console.log('key_pressed');
      if (p5.key == 'w')
        socket.emit('playerMovePaddle', -15);
      else if (p5.key == 's')
        socket.emit('playerMovePaddle', 15);
    }
  }
  return <ReactP5Wrapper sketch={sketch} socket={socket}/>;
  };


export default GameCanvas;
