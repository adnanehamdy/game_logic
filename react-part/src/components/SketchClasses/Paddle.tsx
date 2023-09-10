import p5 from "p5";
import { useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext";

class Paddle {
    show = () => {
    const socket = useContext(SocketContext);
    socket.emit('draw paddles', );
        // this.p5.background(255);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.x, this.y, this.w, this.h);
    }
}

export default Paddle;