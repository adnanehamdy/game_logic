// import React from 'react';
import { useContext, useEffect } from "react";
import p5 from "p5";
import ball from "./SketchClasses/ball";
import Paddle from "./SketchClasses/Paddle"
import { SocketContext } from "../contexts/SocketContext";

import { metaData } from "./SketchInterfaces/metaData";

const Sketch = () => {
  const socket = useContext(SocketContext);
  const p = (p5: p5) => {  
    // let ball: ball;
    // let paddle: Paddle;
    p5.setup = () => {
      let metadata : metaData = 
      { windowWidth : p5.windowWidth, windowHeight : p5.windowHeight, 
        width : p5.width, height : p5.height};
      socket.emit('join a game',{metadata} ,(data: string) =>
      {
        console.log(data);
      });
      p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      // right = new Paddle(p5.windowWidth, p5);
      // ball = new ball(p5);
    };
    
    p5.draw = () => {
      p5.background(200);
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
      if (p5.key == 'o')
      {
        // left.move(-15);
        socket.emit('message', -15, (data : number) => console.log(data));
      }
      else if (p5.key == 'l')
      {
        // left.move(15);
        socket.emit('message', -15, (data : number) => console.log(data));
      }
      if (p5.key == 'w')
      {
        socket.emit('message', -15, (data : number) => console.log(data));
        // right.move(-15);
      }
        else if (p5.key == 's')
        {
          socket.emit('message', -15, (data : number) => console.log(data));
          // right.move(15);
        }
  }
};

useEffect(() => {
  const p5Object = new p5(p);
  return p5Object.remove;
}, []);

  return <></>;
};

export default Sketch;
