import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway(
  {
    cors: {
      origin: ['http://localhost:5173'],
    },
  }
)
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('join a game')
  gamesetup(@MessageBody() body: number) {
   // if last room is full
    // setup game class 
    // else join the game class and get your paddle
  }
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connectd');
    });
  }
}
