// import React from 'react';
import { useContext, useEffect } from "react";
import p5 from "p5";
import Puck from "./SketchClasses.tsx/Puck";
import Paddle from "./SketchClasses.tsx/Paddle"
import { SocketContext } from "../contexts/SocketContext";


const Sketch = () => {
  const socket = useContext(SocketContext);
  const p = (p5: any) => {
    let puck: Puck;
    let left: Paddle;
    let right: Paddle;

    p5.setup = () => {
      socket.on('connect', ()=>
      {
        console.log('connected');
      });
      console.log(p5.width);
      p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
      right = new Paddle(p5.windowWidth, p5);
      left = new Paddle(0, p5);
      puck = new Puck(p5);
    };

    p5.draw = () => {
      p5.background(200);
      left.show();
      right.show();
      left.update();
      right.update();
      puck.update();
      puck.Show();
      puck.edges();
    };
    p5.keyReleased = () => {
      puck.Show();
      left.move(0);
      right.move(0);
    }
    p5.keyPressed = () => {
      console.log('key_pressed');
      if (p5.key == 'o')
      {
        left.move(-15);
        socket.emit('message', -15);
      }
      else if (p5.key == 'l')
        left.move(15);
      if (p5.key == 'w')
        right.move(-15);
      else if (p5.key == 's')
        right.move(15);
    }
  };

  useEffect(() => {
    const p5Object = new p5(p);
    return p5Object.remove;
  }, []);

  return <></>;
};

export default Sketch;
