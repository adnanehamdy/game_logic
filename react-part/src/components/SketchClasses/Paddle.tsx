import p5 from "p5";
import { useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { coordonation } from "../SketchInterfaces/coordonation";
class Paddle {
    // const socket = useContext(SocketContext);
    p5: p5;
    x : number;
    y : number;
    w : number;
    h :number;
    constructor(p5: p5)
    {
        this.p5 = p5;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }
    show = () => {
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect( this.x,
        this.y, this.w, this.h);
    // const socket = useContext(SocketContext);
    // socket.emit('draw paddles', );
        // this.p5.background(255);
    }
}

export default Paddle;